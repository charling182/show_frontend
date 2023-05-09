import { request } from 'umi';

/**
 * 获取菜单列表
 */
export async function getMenuList(params: any) {
    return request('/menus/list', {
        method: 'GET',
        params,
    });
}

/**
 * 批量删除菜单
 */
export async function deleteMenu(params: any) {
    return request('/menus', {
        method: 'DELETE',
        params,
    });
}

/**
 * 新增菜单
 */
export async function addMenu(data: any) {
    return request('/menus', {
        method: 'POST',
        data,
    });
}

/**
 * 更新菜单
 */
export async function updateMenu(data: any) {
    return request('/menus', {
        method: 'PUT',
        data,
    });
}
