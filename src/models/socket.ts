import { ImmerReducer, Subscription, Effect } from 'umi';
import { socketUrl } from '~/config/_vars';
import io from 'socket.io-client';
import { getJwtFromLocalstorage } from '@/utils';
import { getMessageList as getList } from '@/api';
import { groupBy, cloneDeep } from 'lodash';
import { dateHumanizeFormat } from '@/utils';
import dayjs from 'dayjs';

interface SocketSyncData {
    action: string;
    clientId: string;
    id: string;
    method: string;
    params: any;
}

let haveSocketConnect: boolean = false;

// 获取在线用户的id数组
const getOnlineUserIds = (state: any, onlineUserSocketIds: any[]) => {
    const onlineUserIds: string[] = onlineUserSocketIds.map((item) => item.split('_')[0]);
    console.log('getOnlineUserIds---------', Array.from(new Set(onlineUserIds)));
    state.onlineUserIds = Array.from(new Set(onlineUserIds));
};

// 侦听socket的连接事件
const socketConnectEvent = (dispatch: any) => {
    if (haveSocketConnect) return;
    haveSocketConnect = true;
    // 不能写在外面,因为外面只能执行一次
    // 进入登录页面,该model文件就会被执行,此时getJwtFromLocalstorage()还是没有值的情况,因为还没登录,这会导致
    // socketInstance的query无参数
    // 获取localStorage中的token信息
    const stringflyData: string = getJwtFromLocalstorage() || '';
    const parseData = stringflyData ? JSON.parse(stringflyData) : {};

    const socketInstance = io(socketUrl, {
        autoConnect: false, // 是否自行开启连接,除了下面的setup,没有什么好的时机去手动开启连接
        transports: ['websocket'],
        query: {
            userId: parseData.userId,
            accessToken: parseData.accessToken,
        },
    });
    console.log('socketConnectEvent--------');
    dispatch({ type: 'SocketConnect', payload: socketInstance });
    socketInstance.on('message', ({ action: _action, params, id }: SocketSyncData) => {
        console.log('socketInstance.on----------create:message', _action, params, id);
        dispatch({ type: 'getMessageEffects' });
        socketInstance.emit('ack', {
            id,
            result: 'OK',
        });
    });
    // socket已经连接,就不要再重复连接/注册侦听事件了
    socketInstance.on('sync', ({ action: _action, params, id }: SocketSyncData) => {
        // console.log('socketInstance.on----------', _action, params, id);
        switch (_action) {
            case 'online': {
                console.log('在线事件-----------', params);

                dispatch({ type: 'SetonlineUserSocketIds', payload: params });
                break;
            }
            case 'join': {
                console.log('加入事件-----------', params);
                dispatch({ type: 'SetJoinUserSocketIds', payload: params });
                break;
            }
            case 'leave': {
                console.log('离开事件-----------', params);
                dispatch({ type: 'SetLeaveUserSocketIds', payload: params });
                break;
            }
            default:
                break;
        }
        // socket 全局 Ack确认,看服务器能否正常收到消息,可以收到说明连接正常,就不要再有效期内重复发送消息
        // 全局侦听了ack事件,所以在每个页面去单独写侦听事件就不需要再回复ack了,因为全局已经回复了,意思就是说
        // 页面会侦听到,全局也会侦听到
        // 不能使用相同的侦听事件名称,因为每个页面组件被销毁时,会执行卸载侦听事件,如果事件名称相同,就会导致项目内所有侦听事件被卸载
        // 那么socketInstance.emit('ack'也就无法共用了,必须在每一个有侦听事件的地方,单独写一遍
        socketInstance.emit('ack', {
            id,
            result: 'OK',
        });
    });
};
// 退出时,socket断开连接
const socketDisconnect = (dispatch: any) => {
    haveSocketConnect = false;
    dispatch({ type: 'SocketDisconnect' });
};

// 处理消息列表
const dataListFilter = (list: any[] = [], state) => {
    console.log('dataListFilter---------', list);

    const dataList = cloneDeep(list).filter((item) => {
        item.created_at = dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss');
        item.created_at_humanize = dateHumanizeFormat(item.created_at).value;
        return item.is_read === 0;
    });
    state.messageData = groupBy(dataList, 'type');
};

export interface SocketModelState {
    socketInstance: any;
    onlineUserSocketIds: string[]; // 在线用户可能有多个socketId
    onlineUserIds: string[]; // 在线用户ids,同一个用户可能会拥有多个socket连接,所以也可能有多个socketId
    messageCount: number;
    messageData: any;
}
export interface SocketModelType {
    namespace: 'socket';
    state: SocketModelState;
    reducers: {
        // 启用 immer 之后
        SocketConnect: ImmerReducer<SocketModelState>;
        SocketDisconnect: ImmerReducer<SocketModelState>;
        SetonlineUserSocketIds: ImmerReducer<SocketModelState>;
        SetJoinUserSocketIds: ImmerReducer<SocketModelState>;
        SetLeaveUserSocketIds: ImmerReducer<SocketModelState>;
        SetMessage: ImmerReducer<SocketModelState>;
    };
    effects: {
        socketEffects: Effect;
        getMessageEffects: Effect;
    };
    subscriptions: { setup: Subscription };
}

const SocketModel: SocketModelType = {
    namespace: 'socket',

    state: {
        socketInstance: null,
        onlineUserSocketIds: [],
        onlineUserIds: [],
        messageCount: 0,
        messageData: [],
    },
    reducers: {
        // socket建立连接
        SocketConnect(state, { payload }) {
            state.socketInstance = payload;
            state.socketInstance.connect();
            console.log('SocketConnect-----------socket建立连接');
        },
        // 登出时,socket断开连接
        SocketDisconnect(state) {
            console.log('SocketDisconnect-----------登出时,socket断开连接');
            if (state.socketInstance) {
                state.socketInstance.disconnect();
                state.socketInstance.off();
            }
        },
        SetonlineUserSocketIds(state, { payload }) {
            state.onlineUserSocketIds = payload;
            // 同一个客户端的多个socketId,_之前的数字字符串是一样的,就是userId所以可以去重,这是服务端的socket插件自行生成的
            getOnlineUserIds(state, state.onlineUserSocketIds);
        },
        SetJoinUserSocketIds(state, { payload }) {
            const data: any = new Set(state.onlineUserSocketIds);
            state.onlineUserSocketIds = Array.from(data.add(payload.socketId));
            // 同一个客户端的多个socketId,_之前的数字字符串是一样的,就是userId所以可以去重,这是服务端的socket插件自行生成的
            getOnlineUserIds(state, state.onlineUserSocketIds);
            console.log(
                '加入事件同步修改-----------',
                state.onlineUserSocketIds,
                payload,
                state.onlineUserIds
            );
        },
        SetLeaveUserSocketIds(state, { payload }) {
            const data: any = new Set(state.onlineUserSocketIds);
            data.delete(payload.socketId);
            state.onlineUserSocketIds = Array.from(data);
            // 同一个客户端的多个socketId,_之前的数字字符串是一样的,就是userId所以可以去重,这是服务端的socket插件自行生成的
            getOnlineUserIds(state, state.onlineUserSocketIds);
            console.log(
                '离开事件同步修改-----------',
                state.onlineUserSocketIds,
                payload,
                state.onlineUserIds
            );
        },
        SetMessage(state, { payload: { count, rows } }) {
            state.messageCount = count;
            dataListFilter(rows || [], state);
        },
    },
    effects: {
        // 对于监听socket事件,不用异步
        *socketEffects({ payload, state }, { call, put, select }) {},
        // 获取所有消息
        *getMessageEffects({ payload }, { call, put, select }) {
            // const { userInfo } = yield select((state: any) => state.user);
            const stringflyData: string = getJwtFromLocalstorage() || '';
            const parseData = stringflyData ? JSON.parse(stringflyData) : {};
            const { code, data } = yield call(getList, {
                receiver_id: parseData.userId,
                prop_order: 'id',
                order: 'desc',
                is_read: 0,
            });
            if (code === 200) {
                yield put({ type: 'SetMessage', payload: data });
            }
        },
    },
    // 在 dva 中，subscriptions 是一种特殊的函数，用于在应用的生命周期中订阅额外的数据源。
    // 通过在 subscriptions 中注册监听器，我们可以在页面组件挂载前、卸载后或页面可见性变化
    // 时执行一些异步操作，如启动 WebSocket 连接、初始化某些状态等。
    subscriptions: {
        // 即使某个model未被使用，也会在整个dva应用初始化时被加载，其中包括执行subscriptions
        // 的setup方法。这是因为dva将所有的model都打包在一起进行管理和加载，而不是按需加载。
        // 因此，即使某个model未被使用，它也会被打包在一起，并随着应用的初始化一起被加载和执行。
        // subscriptions属于dva model的生命周期钩子函数，即使未被使用，也会被整体执行一遍。
        // 仅仅执行一次,登录或者退出是不会再次执行的,除非刷新页面,return中因为是被监听的部分,所以
        // 会被执行多次,但是setup只会执行一次
        setup({ dispatch, history }) {
            // setup方法,在应用初始化时会执行一次,即使该model没有被用到
            // socket的连接之所以放在这里是因为在入口问题app.ts中或者叫在运行时还无法获取到
            // dva实例,也就拿不到定义的model,所以只能在这里进行连接,
            // 但也有一个问题,在 app.start() 时被执行,意味着你在login页面就已经执行了,登录之后
            // 不会再次执行,
            // 监听路由变化
            return history.listen((location) => {
                // 获取localStorage中的token信息
                const stringflyData: string = getJwtFromLocalstorage() || '';
                // 进入登录页面,该model文件就会被执行,此时getJwtFromLocalstorage()还是没有值的情况,因为还没登录,这会导致
                // socketInstance的query无参数
                const parseData = stringflyData ? JSON.parse(stringflyData) : {};
                console.log(
                    'subscriptions----------',
                    location.pathname !== '/login',
                    parseData.accessToken,
                    Boolean(location.pathname !== '/login' && parseData.accessToken)
                );
                // 根据不同的路由触发不同的 subscriptions
                // 说明其登陆了,且获取了登录信息,websocket连接需要登录token
                // !haveSocketConnect防止登录后,切换页面,重复连接socket
                if (location.pathname !== '/login' && parseData.accessToken && !haveSocketConnect) {
                    socketConnectEvent(dispatch);
                }
                if (location.pathname === '/login' || !parseData.accessToken) {
                    // 非登录页面,且没有登录信息,说明退出了,socket断开连接
                    socketDisconnect(dispatch);
                }
            });
        },
    },
};

export default SocketModel;
