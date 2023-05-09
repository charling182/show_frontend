import { ImmerReducer, Subscription } from 'umi';
import { socketUrl } from '~/config/_vars';
import io from 'socket.io-client';

export interface SocketModelState {
    socketInstance: any;
}
export interface SocketModelType {
    namespace: 'socket';
    state: SocketModelState;
    reducers: {
        // 启用 immer 之后
        SocketConnect: ImmerReducer<SocketModelState>;
        SocketDisconnect: ImmerReducer<SocketModelState>;
    };
    subscriptions: { setup: Subscription };
}

const SocketModel: SocketModelType = {
    namespace: 'socket',

    state: {
        socketInstance: io(socketUrl, {
            autoConnect: false, // 让其自行开启连接,因为没有什么好的时机去手动开启连接
            transports: ['websocket'],
        }),
    },
    reducers: {
        // socket建立连接
        SocketConnect(state) {
            state.socketInstance.connect();
        },
        // 登出时,socket断开连接
        SocketDisconnect(state) {
            state.socketInstance.disconnect();
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
        setup({ dispatch }) {
            // setup方法,在应用初始化时会执行一次,即使该model没有被用到
            // socket的连接之所以放在这里是因为在入口问题app.ts中或者叫在运行时还无法获取到
            // dva实例,也就拿不到定义的model,所以只能在这里进行连接
            dispatch({ type: 'SocketConnect' });
        },
    },
};

export default SocketModel;
