/**
 * 遍历路由表，根据`path`查找路由对象。
 *
 * @export
 * @param {types.IRoute[]|undefined} routes 全局路由表，通过`props.routes`来获取。
 *
 * 注意：访问`props.routes`在`typescript`中会提示不存在，需要自己手动声明，参见下面的示例代码。
 * @param {string} path 路由路径
 * @returns {types.IRoute|undefined} 路由对象，如果没找到的话，返回`undefined`
 */
export function getRouteByPath(
    routes: types.IRoute[] | undefined,
    path: string
): types.IRoute | undefined {
    if (!routes) {
        return undefined;
    }
    const matchedPath = routes.find((r) => r.path === path);
    if (matchedPath) {
        return matchedPath;
    } else {
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            if (route.routes) {
                const matchedChildRoute = getRouteByPath(route.routes, path);
                if (matchedChildRoute) {
                    return matchedChildRoute;
                }
            }
        }
        return undefined;
    }
}

/**
 * `getFirstMenu`方法的调用选项
 */
declare type IOption = {
    /**
     * 如果指定了父路由，则从此父路由下查找，否则从全部路由表中查找。
     * 如果指定了不存在的父路由，则永远返回`undefined`
     *
     * @type {string}
     */
    parentRoute?: string;
    /**
     * 查找范围是否包含父路由本身，仅在指定了 @param parentRoute 选项时起作用。
     *
     * 如果设置为`true`，则如果父路由有权限的话，会优先返回父路由。
     * 如果设置为`false`，即便是父路由有权限，也不会返回父路由，而是始终查找子路由。
     */
    includeParentRoute?: boolean;
};
/**
 * 获取第一个有权限的菜单路由地址
 *
 * @export
 * @param {types.IRoute[]} routes 全局路由表，通过`props.routes`来获取。
 *
 * 注意：访问`props.routes`在`typescript`中会提示不存在，需要自己手动声明，参见下面的示例代码。
 * @returns {string|undefined} 匹配的路由地址。如果没有找到匹配的路由，则返回`undefined`
 *
 * @example
 *
 * (props: IRouteComponentProps) => {
 *      const route = getFirstMenu(props.routes);
 *      if (route) {
 *         // 跳转到第一个有权限的路由
 *         props.history.push(route);
 *      }
 *      else {
 *         // 否则跳转到固定的默认路由页面
 *         props.history.push(defaultRoute);
 *      }
 * }
 */
export function getFirstMenu(
    routes: types.IRoute[] | undefined,
    options: IOption = {
        includeParentRoute: false,
    }
) {
    const matched: types.IRoute[] = [];
    if (options.parentRoute) {
        const parentRoute = getRouteByPath(routes, options.parentRoute);
        if (parentRoute) {
            if (options.includeParentRoute && parentRoute.menu && !parentRoute.unaccessible) {
                return options.parentRoute;
            } else {
                getFirstMenuRecursively({ routes: parentRoute.routes }, matched);
            }
        }
    }
    if (!matched.length) getFirstMenuRecursively({ routes }, matched);
    return matched[0]?.path;
}

export function checkPathAccess(routes: types.IRoute[] | undefined, path: string) {
    const matched: types.IRoute[] = [];
    checkPathAccessCopy({ routes }, matched, path);
    return matched[0];
}

function checkPathAccessCopy(
    route: types.IRoute | undefined,
    matched: types.IRoute[],
    path: string
) {
    if (matched.length > 0) {
        return;
    }
    if (route) {
        route.routes?.forEach((child: types.IRoute) => {
            checkPathAccessCopy(child, matched, path);
        });
        if (route.menu && route.path === path) {
            matched.push(route);
        }
    }
}

function getFirstMenuRecursively(route: types.IRoute | undefined, matched: types.IRoute[]) {
    if (matched.length > 0) {
        return;
    }
    if (route) {
        // 深度优先
        route.routes?.forEach((child: types.IRoute) => {
            getFirstMenuRecursively(child, matched);
        });
        if (route.menu && !route.unaccessible) {
            matched.push(route);
        }
    }
}
