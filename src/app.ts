import { layout } from './app-config';
import { history } from 'umi';
import './plugin-runtime-config/react-placeholder';

/**
 * umi 运行是配置 https://umijs.org/zh-CN/docs/runtime-config
 * modifyClientRenderOpts(fn) 修改 clientRender 参数
 * patchRoutes({ routes }) 修改路由
 * render(oldRender: Function) 覆写 render
 * onRouteChange({ routes, matchedRoutes, location, action }) 在初始加载和路由切换时做一些事情
 * rootContainer(LastRootContainer, args) 修改交给 react-dom 渲染时的根组件
 * 更多配置项 Umi 允许插件注册运行时配置，如果你使用插件，肯定会在插件里找到更多运行时的配置项
 */

interface IRouterComponentProps {
  routes: types.IRoute[];
  plugin: Plugin;
  history: any;
  ssrProps?: object;
  defaultTitle?: string;
  dynamicImport?: boolean;
  isServer?: boolean;
}
interface IOpts extends IRouterComponentProps {
  rootElement?: string | HTMLElement;
  callback?: () => void;
}

// 修改路由
// export function patchRoutes(args: { routes: types.IRoute[] }) {
//     // 隐藏导航栏、菜单栏、底部栏
//     const onlyShowMain = history.location.query?.onlyShowMain;
//     if (onlyShowMain && onlyShowMain === 'true') {
//         layout.pure = true;
//         sessionStorage.setItem('only-show-main', 'true');
//     }
//     return args.routes;
// }
export function patchRoutes(args: { routes: types.IRoute[] }) {
  // 隐藏导航栏、菜单栏、底部栏
  // const onlyShowMain = history.location.query?.onlyShowMain;
  // if (onlyShowMain && onlyShowMain === 'true') {
  //     layout.pure = true;
  //     sessionStorage.setItem('only-show-main', 'true');
  // }
  let routes = [...args.routes];

  routes = routes.map((route) => {
    let test = { ...route };
    test.routes = test.routes.map((item) => {
      let testChildren = { ...item };
      if (testChildren.path === '/personal-center') {
        testChildren.routes = testChildren.routes.filter((item) => {
          return item.path !== '/personal-center/test';
        });
      }
      return testChildren;
    });
    return test;
  });
  console.log('patchRoutes', routes);

  return args.routes;
}

export function onRouteChange({ location, routes, action }) {
  console.log(
    'onRouteChange',
    location,
    routes,
    action,
    location === '/personal-center/test-2',
  );
  if (location.pathname === '/personal-center/test-2') {
    console.log('进入');

    history.push('/404');
  }
}
// export function onRouteUpdate({ location, routes, action }) {
//   console.log('onRouteUpdate', location, routes, action, location === '/personal-center/test-2');

// }

export function render(oldRender) {
  console.log('render', oldRender());
  // fetch('/api/auth').then(auth => {
  //   if (auth.isLogin) { oldRender() }
  //   else {
  //     history.push('/login');
  //     oldRender()
  //   }
  // });
}

// umi 插件运行时配置

export { layout };
export { request } from './plugin-runtime-config/request';
export { getInitialState } from './plugin-runtime-config/initial-state';

// Udesk.init();
// runInit();
