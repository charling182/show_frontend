import { history, getDvaApp } from 'umi';
import { getUserInfo } from '@/api';

// 该配置是一个 async 的 function。会在整个应用最开始执行，返回值会作为全局共享的数据。
// Layout 插件、Access 插件以及用户都可以通过 useModel('@@initialState') 直接获取到这份数据。
export async function getInitialState() {
    const dvaApp = getDvaApp();
    console.log('getInitialState------2222222', dvaApp);
    // const socketState = dvaApp._store.getState().socket;
    // console.log('Counter state:-------', socketState);
    // dvaApp._store.dispatch({ type: 'socket/SocketConnect' });
    let initData = {};
    const { data, code } = await getUserInfo();
    if (code === 200) {
        initData = data;
    } else {
        history.push('/login');
    }
    return initData;
}
