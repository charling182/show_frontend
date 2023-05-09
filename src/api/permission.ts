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
