import { request } from 'umi';

/**
 * 获取所有权限列表
 */
export async function getPermissionList(params: any) {
    return request('/permissions/list', {
        method: 'GET',
        params,
    });
}
/**
 * 添加权限
 */
export async function addPermission(params: any) {
    return request('/permissions', {
        method: 'POST',
        data: params,
    });
}
/**
 * 修改权限
 */
export async function updatePermission(params: any) {
    return request('/permissions', {
        method: 'PUT',
        data: params,
    });
}
/**
 * 删除权限
 */
export async function deletePermission(params: { ids: number[] }) {
    return request('/permissions', {
        method: 'DELETE',
        data: params,
    });
}
