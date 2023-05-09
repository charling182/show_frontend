import React from 'react';
// import { history, getIntl, getLocale, request, Link, useAccess } from 'umi';
import type { LayoutConfig, ILayoutRuntimeConfig } from '@@/plugin-layout/layout/types/interface';
// import getAccess from '@/access';

import RightContent from '@/components/right-content';
import sortBy from 'lodash-es/sortBy';
import { title, prefixCls } from '~/config/_vars.ts';
import Logo from '@/components/logo';
import { Link } from 'umi';
import { Menu } from 'antd';
import { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-layout';
import {
    DesktopOutlined,
    LineChartOutlined,
    AuditOutlined,
    LayoutOutlined,
} from '@ant-design/icons';

const IconMap: any = {
    DesktopOutlined: <DesktopOutlined />,
    LineChartOutlined: <LineChartOutlined />,
    AuditOutlined: <AuditOutlined />,
    LayoutOutlined: <LayoutOutlined />,
};

const logoTitle: string = title.charAt(0).toUpperCase() + title.slice(1);

// // 对接insight 菜单 end

// const intl = getIntl(getLocale());
// export const layout: ILayoutRuntimeConfig & LayoutConfig & BasicLayoutProps & { logo?: any } = {
//     name: localStorage.getItem(DEFAULT_TITLE_KEY) || intl.formatMessage({ id: 'app.name' }),
//     // // @ts-ignore
//     // logo: Logo,
//     prefixCls: `${prefixCls}-pro`,
//     logout: () => {
//         sessionStorage.removeItem('wxbl-auth-token');
//         request(`/logout`, {
//             method: 'POST',
//         })
//             .then((res) => {
//                 history.push('/auth/login');
//             })
//             .catch((res) => {});
//     },
//     patchMenus: (menuItems: MenuDataItem[], { initialState }: any): MenuDataItem[] => {
//         // 控制伊利的dashboard工作台页面是否显示菜单，配合pages/index.ts文件的getFirstMenu实现默认显示
//         const dashBoardSwitch = initialState?.dashBoardSwitch === 'YES';
//         const idx = menuItems.findIndex((i) => i.key === '/workbench-dashboard');
//         const idx1 = menuItems.findIndex((i) => i.key === '/workbench');
//         if (idx !== -1) {
//             menuItems[idx].hideInMenu = !dashBoardSwitch;
//         }
//         if (idx1 !== -1 && !menuItems[idx1].hideInMenu) {
//             // workbench 与 workbench-dashboard 目前关系为互斥
//             menuItems[idx1].hideInMenu = dashBoardSwitch;
//         }
//         /** 二级菜单后端判断是否返回 */
//         // const rpaSwitch = initialState?.sysCompany?.rpaType === 'third';
//         // const idx2 = menuItems.findIndex((i) => i.key === '/rpa-robot');
//         // if (idx2 !== -1) {
//         //     const idx3 = menuItems[idx2].children.findIndex((i) => i.key === '/rpa-robot/pull-groups/list');
//         //     if (idx3 != -1) {
//         //         menuItems[idx2].children[idx3].hideInMenu = rpaSwitch;
//         //     }
//         // }
//         const access = getAccess(initialState);
//         let accessibleItems = getAccessibleMenuItems(menuItems, access);
//         let sorted = sortRoutes(accessibleItems);
//         return sorted;
//     },
//     siderWidth: 200,

//     menuItemRender: (menuItemProps: any, defaultDom: any) => {
//         const isGoInsightMenu = menuItemProps.key === GO_INSIGHT_MENU_KEY;
//         if (isGoInsightMenu) {
//             let cloneDefaultDom = React.cloneElement(defaultDom, {
//                 onClick: () => {
//                     goInsightAction();
//                 },
//                 style: {
//                     cursor: 'pointer',
//                     width: '100%',
//                     display: 'block',
//                     position: 'absolute',
//                     left: 0,
//                     top: 0,
//                     paddingLeft: '32px',
//                     zIndex: 10,
//                 },
//             });
//             return cloneDefaultDom;
//         }

//         if (menuItemProps.isUrl || menuItemProps.routes) {
//             return defaultDom;
//         }
//         if (menuItemProps.path && location.pathname !== menuItemProps.path) {
//             return <Link to={menuItemProps.path}>{defaultDom}</Link>;
//         }

//         return defaultDom;
//     },
//     headerContentRender: (props: BasicLayoutProps) => {
//         return (
//             <div>
//                 <Ccpass />
//             </div>
//         );
//     },
//     rightRender: (initialState: any, setInitialState: any, runtimeLayout: ILayoutRuntimeConfig) => {
//         if (initialState) {
//             return (
//                 <>
//                     <Right
//                         initialState={initialState}
//                         onPopConfigChange={(num: number) => {
//                             sessionStorage.setItem('CCPS_POPMODA_CONFIG', String(num));
//                         }}
//                     />
//                 </>
//             );
//         }
//     },
//     menuHeaderRender: LogoRender,
//     pageTitleRender: (props, defaultPageTitle, info) => {
//         return info?.pageName || info?.title;
//     },
// };

// function getAccessibleMenuItems(menuData: MenuDataItem[], access: any) {
//     // 根据item.unaccessible递归过滤子菜单，滤掉unaccessible为true的菜单项
//     const insightAccessible = access[INSIGHT_MENU_ACCESS];
//     return menuData
//         .map((item) => {
//             const accessible = !item.unaccessible;
//             // 统计分析菜单的子菜单(除去高级分析)全部无权限时,统计分析的unaccessible会判定为false,即无权限
//             // 因为高级分析无对应函数组件,所以框架内部按照默认路由把该菜单考虑在内,需要手动添加
//             // locale属性,是为了去寻找对应的菜单名称,若无权限,为false
//             if (accessible || (item.key === ANALYSIS_KEY && insightAccessible)) {
//                 let newItem: MenuDataItem = { ...item };
//                 if (newItem.access && !newItem.hideInMenu) {
//                     newItem.hideInMenu = !access[newItem.access];
//                 }
//                 if (item.key === ANALYSIS_KEY) {
//                     newItem.unaccessible = false;
//                     newItem.locale = 'menu.analysis';
//                 }
//                 function helper(key: string) {
//                     if (newItem[key]) {
//                         newItem[key] = getAccessibleMenuItems(newItem[key], access);
//                         //    在统计分析下新增一个菜单 高级分析
//                         if (newItem.key === ANALYSIS_KEY) {
//                             if (insightAccessible) {
//                                 const insightAnalysisMenu: any = {
//                                     locale: 'menu.analysis.insightAnalysis',
//                                     key: GO_INSIGHT_MENU_KEY,
//                                     path: GO_INSIGHT_MENU_INIT_PATH,
//                                     menu: { name: GO_INSIGHT_MENU_NAME },
//                                     name: GO_INSIGHT_MENU_NAME,
//                                     order: 40,
//                                     access: INSIGHT_MENU_ACCESS,
//                                     unaccessible: !insightAccessible,
//                                     hideInMenu: !insightAccessible,
//                                 };
//                                 newItem[key] = Array.isArray(newItem.routes)
//                                     ? newItem[key].concat(insightAnalysisMenu)
//                                     : [insightAnalysisMenu];
//                             }
//                         }
//                     }
//                 }
//                 helper('children');
//                 helper('routes');
//                 return newItem;
//             } else {
//                 return null;
//             }
//         })
//         .filter(Boolean) as MenuDataItem[];
// }

// function sortRoutes(routes: MenuDataItem[]) {
//     if (routes) {
//         const sorted = sortBy(routes, 'order');
//         sorted.forEach((route) => {
//             // eslint-disable-next-line no-param-reassign
//             route.children = sortRoutes(route.children as MenuDataItem[]);
//             // eslint-disable-next-line no-param-reassign
//             route.routes = sortRoutes(route.routes as MenuDataItem[]);
//         });
//         return sorted;
//     } else {
//         return routes;
//     }
// }

export const layout: LayoutConfig & BasicLayoutProps = {
    // @ts-ignore

    logo: <Logo />,
    title: logoTitle,
    layout: 'mix',
    splitMenus: true,
    fixedHeader: true,
    prefixCls: `${prefixCls}-pro`,
    contentWidth: 'Fluid',
    siderWidth: 208,
    breakpoint: false,
    // menu: {
    //   type: 'group',
    // },
    // headerHeight: 64,
    bgLayoutImgList: [
        {
            src:
                'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
        },
        {
            src:
                'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
        },
        {
            src:
                'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
        },
    ],

    // style: {
    //   minHeight: '100vh',
    //   backgroundColor: 'blue',
    // },
    menuProps: {
        // disabled: true,
        // theme: 'dark',
    },
    patchMenus: (menuItems: MenuDataItem[], { initialState }: any): MenuDataItem[] => {
        let accessibleItems = getAccessibleMenuItems(menuItems);
        // console.log('initialState', initialState);

        // console.log('accessibleItems', accessibleItems);
        let sorted = sortRoutes(accessibleItems);
        console.log('sorted', sorted);
        return sorted;
        // 控制伊利的dashboard工作台页面是否显示菜单，配合pages/index.ts文件的getFirstMenu实现默认显示
        // const dashBoardSwitch = initialState?.dashBoardSwitch === 'YES';
        // const idx = menuItems.findIndex((i) => i.key === '/workbench-dashboard');
        // const idx1 = menuItems.findIndex((i) => i.key === '/workbench');
        // if (idx !== -1) {
        //     menuItems[idx].hideInMenu = !dashBoardSwitch;
        // }
        // if (idx1 !== -1 && !menuItems[idx1].hideInMenu) {
        //     // workbench 与 workbench-dashboard 目前关系为互斥
        //     menuItems[idx1].hideInMenu = dashBoardSwitch;
        // }
        /** 二级菜单后端判断是否返回 */
        // const rpaSwitch = initialState?.sysCompany?.rpaType === 'third';
        // const idx2 = menuItems.findIndex((i) => i.key === '/rpa-robot');
        // if (idx2 !== -1) {
        //     const idx3 = menuItems[idx2].children.findIndex((i) => i.key === '/rpa-robot/pull-groups/list');
        //     if (idx3 != -1) {
        //         menuItems[idx2].children[idx3].hideInMenu = rpaSwitch;
        //     }
        // }
        // const access = getAccess(initialState);
        // let accessibleItems = getAccessibleMenuItems(menuItems, access);
        // let sorted = sortRoutes(accessibleItems);
        // return sorted;
    },
    rightContentRender: () => <RightContent />,
    // footerRender: () => <div>底部内容区</div>,
    // headerContentRender: () => <div>头部内容区</div>,
    // onPageChange: () => {
    //   const { currentUser } = initialState;
    //   const { location } = history;
    //   // 如果没有登录，重定向到 login
    //   if (!currentUser && location.pathname !== '/user/login') {
    //     history.push('/user/login');
    //   }
    // },
    // menuHeaderRender: () => 'menuHeaderRender',
    // menuRender: (menuItemProps: any, defaultDom: any) => {
    //   console.log('menuItemProps', menuItemProps);
    //   return <>3456787654</>
    // },
    // pageTitleRender: () => 'pageTitleRender',
    // menuItemRender: (menuItemProps: any, defaultDom: any) => {
    //   return (
    //     <div>
    //       <span style={{ marginRight: '4px' }}>
    //         {menuItemProps.menu.icon ? IconMap[menuItemProps.menu.icon] : ''}
    //       </span>
    //       <Link to={menuItemProps.path}>{menuItemProps.menu.name}</Link>
    //     </div>
    //   );
    // },
    // subMenuItemRender: (itemProps: MenuDataItem) => {
    //   return (
    //     <div>
    //       <span style={{ marginRight: '4px' }}>
    //         {itemProps.menu.icon ? IconMap[itemProps.menu.icon] : ''}
    //       </span>
    //       <Link to={itemProps.path}>{itemProps.menu.name}</Link>
    //     </div>
    //   );
    // },
};

function sortRoutes(routes: MenuDataItem[]) {
    if (routes) {
        const sorted = sortBy(routes, 'order');
        sorted.forEach((route) => {
            // eslint-disable-next-line no-param-reassign
            route.children = sortRoutes(route.children as MenuDataItem[]);
            // eslint-disable-next-line no-param-reassign
            route.routes = sortRoutes(route.routes as MenuDataItem[]);
        });
        return sorted;
    } else {
        return routes;
    }
}

function getAccessibleMenuItems(menuData: MenuDataItem[]) {
    // 根据item.unaccessible递归过滤子菜单，滤掉unaccessible为true的菜单项
    // const insightAccessible = access[INSIGHT_MENU_ACCESS];
    // return menuData
    //     .map((item) => {
    //         // const accessible = !item.unaccessible;
    //         // 统计分析菜单的子菜单(除去高级分析)全部无权限时,统计分析的unaccessible会判定为false,即无权限
    //         // 因为高级分析无对应函数组件,所以框架内部按照默认路由把该菜单考虑在内,需要手动添加
    //         // locale属性,是为了去寻找对应的菜单名称,若无权限,为false
    //             let newItem: MenuDataItem = { ...item };
    //             // if (newItem.access && !newItem.hideInMenu) {
    //             //     newItem.hideInMenu = !access[newItem.access];
    //             // }
    //             // if (item.key === ANALYSIS_KEY) {
    //             //     newItem.unaccessible = false;
    //             //     newItem.locale = 'menu.analysis';
    //             // }
    //             function helper(key: string) {
    //                 if (newItem[key]) {
    //                     newItem[key] = getAccessibleMenuItems(newItem[key]);
    //                     //    在统计分析下新增一个菜单 高级分析
    //                 }
    //             }
    //             helper('children');
    //             helper('routes');
    //             return newItem;
    //     })
    //     .filter(Boolean) as MenuDataItem[];

    return menuData.filter((item, index) => index !== 2);
}
