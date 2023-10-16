import { ImmerReducer, Subscription, Effect } from 'umi';
import { socketUrl } from '~/config/_vars';
import io from 'socket.io-client';
import { getJwtFromLocalstorage } from '@/utils';

interface SocketSyncData {
    action: string;
    clientId: string;
    id: string;
    method: string;
    params: any;
}

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

let socketConnect: boolean = false;

// 侦听socket的连接事件
const socketConnectEvent = (dispatch: any) => {
    if (socketConnect) return;
    dispatch({ type: 'SocketConnect' });
    // socket已经连接,就不要再重复连接/注册侦听事件了
    socketInstance.on('sync', ({ action: _action, params, id }: SocketSyncData) => {
        switch (_action) {
            case 'online': {
                dispatch({ type: 'SetonlineUserSocketIds', payload: params });
                break;
            }
            case 'join': {
                dispatch({ type: 'SetJoinUserSocketIds', payload: params });
                break;
            }
            case 'leave': {
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

export interface SocketModelState {
    socketInstance: any;
    socketConnect: boolean;
    onlineUserSocketIds: string[];
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
    };
    effects: {
        socketEffects: Effect;
    };
    subscriptions: { setup: Subscription };
}

const SocketModel: SocketModelType = {
    namespace: 'socket',

    state: {
        socketInstance,
        socketConnect: false,
        onlineUserSocketIds: [],
    },
    reducers: {
        // socket建立连接
        SocketConnect(state) {
            state.socketInstance.connect();
            state.socketConnect = true;
            socketConnect = true;
        },
        // 登出时,socket断开连接
        SocketDisconnect(state) {
            state.socketInstance.disconnect();
            state.socketConnect = false;
            socketConnect = false;
        },
        SetonlineUserSocketIds(state, { payload }) {
            state.onlineUserSocketIds = payload;
        },
        SetJoinUserSocketIds(state, { payload }) {
            const data: any = new Set(state.onlineUserSocketIds);
            state.onlineUserSocketIds = Array.from(data.add(payload.socketId));
        },
        SetLeaveUserSocketIds(state, { payload }) {
            const data: any = new Set(state.onlineUserSocketIds);
            data.delete(payload.socketId);
            state.onlineUserSocketIds = Array.from(data);
        },
    },
    effects: {
        *socketEffects({ payload, state }, { call, put, select }) {
            // yield只能在Generator函数中使用,不能写进下面的socketInstance.on中
            const socketState = yield select((state: any) => state.socket);
            // 如果socket没有连接,则连接,并注册事件
            if (!socketState.socketConnect) {
                yield put({ type: 'SocketConnect' });
                socketInstance.on('sync', ({ action: _action, params, id }: SocketSyncData) => {
                    console.log('socketState----------', socketState);
                    switch (_action) {
                        case 'online': {
                            console.log('params----------', params);
                            put({ type: 'SetonlineUserSocketIds', payload: params });
                            break;
                        }
                        case 'join': {
                            const data = new Set(socketState.onlineUserSocketIds);
                            put({
                                type: 'SetonlineUserSocketIds',
                                payload: Array.from(data.add(params.socketId)),
                            });
                            break;
                        }
                        case 'leave': {
                            const data = new Set(socketState.onlineUserSocketIds);
                            data.delete(params.socketId);
                            put({ type: 'SetonlineUserSocketIds', payload: Array.from(data) });
                            break;
                        }
                        default:
                            break;
                    }
                    // socket 全局 Ack确认,看服务器能否正常收到消息,可以收到说明连接正常,就不要再有效期内重复发送消息
                    // 全局侦听了ack事件,所以在每个页面去单独写侦听事件就不需要再回复ack了,因为全局已经回复了,意思就是说
                    // 页面会侦听到,全局也会侦听到
                    socketInstance.emit('ack', {
                        id,
                        result: 'OK',
                    });
                });
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
        setup({ dispatch, history }) {
            // setup方法,在应用初始化时会执行一次,即使该model没有被用到
            // socket的连接之所以放在这里是因为在入口问题app.ts中或者叫在运行时还无法获取到
            // dva实例,也就拿不到定义的model,所以只能在这里进行连接,
            // 但也有一个问题,在 app.start() 时被执行,意味着你在login页面就已经执行了,登录之后
            // 不会再次执行,
            // 监听路由变化
            return history.listen((location) => {
                // 根据不同的路由触发不同的 subscriptions
                // 说明其登陆了,且获取了登录信息
                if (location.pathname !== '/login' && parseData.accessToken) {
                    socketConnectEvent(dispatch);
                }
            });
        },
    },
};

export default SocketModel;
