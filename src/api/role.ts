import { request } from 'umi';

/**
 * 获取角色列表
 */
export async function getRoleList(params: types.role.roleListParams) {
    return request('/roles/list', {
        method: 'get',
        params,
    });
}

/**
 * 设为默认角色
 */
export async function setDefaultRole(params: { id: number }) {
    return request('/roles/is_default', {
        method: 'put',
        data: params,
    });
}

/**
 * 创建角色
 */
export async function createRole(params: { name: string }) {
    return request('/roles', {
        method: 'post',
        data: params,
    });
}

/**
 * 编辑角色
 */
export async function editRole(params: { id: number; name: string }) {
    return request('/roles', {
        method: 'put',
        data: params,
    });
}

/**
 * 删除角色
 */
export async function deleteRole(params: { ids: number[] }) {
    return request('/roles', {
        method: 'delete',
        data: params,
    });
}

/**
 * 获取角色拥有的菜单
 */
export async function getRoleMenu(params: any) {
    return request('/role_menus/list', {
        method: 'get',
        params,
    });
}

/**
 * 为单个角色批量添加菜单
 */
export async function addRoleBulkMenu(params: { role_id: number; menu_ids: number[] }) {
    return request('/role_menus/bulk_menu', {
        method: 'post',
        data: params,
    });
}

/**
 * 为单个角色批量删除菜单
 */
export async function deleteRoleBulkMenu(params: { ids: number[] }) {
    return request('/role_menus', {
        method: 'delete',
        data: params,
    });
}

/**
 * 获取角色拥有的权限
 */
export async function getRolePermission(params: any) {
    return request('/role_permissions/list', {
        method: 'get',
        params,
    });
}

/**
 * 为单个角色批量添加权限
 */
export async function addRoleBulkPermission(params: { role_id: number; permission_ids: number[] }) {
    return request('/role_permissions/bulk_permission', {
        method: 'post',
        data: params,
    });
}

/**
 * 为单个角色批量删除权限
 */
export async function deleteRoleBulkPermission(params: { ids: number[] }) {
    return request('/role_permissions', {
        method: 'delete',
        data: params,
    });
}

/**
 * 批量创建角色
 */
export async function createRoleBulk(params: any) {
    return request('/user_roles/bulk_role', {
        method: 'post',
        data: params,
    });
}
/**
 * 删除用户角色关联表的记录
 */
export async function deleteUserRole(data: { ids: number[] }) {
    return request(`/user_roles`, {
        method: 'delete',
        data,
    });
}
