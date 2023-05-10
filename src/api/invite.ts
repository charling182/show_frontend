import { request } from 'umi';

/**
 * 创建邀请
 */
export async function createInvite(data: any) {
    return request('/invites', {
        method: 'POST',
        data,
    });
}

/**
 * 获取邀请列表
 */
export async function getInviteList(params: any) {
    return request('/invites/list', {
        method: 'GET',
        params,
    });
}

/**
 * 获取某个邀请
 */
export async function getOneInvite(params: any) {
    return request('/invites', {
        method: 'GET',
        params,
    });
}

/**
 * 更新邀请
 */
export async function updateInvite(data: any) {
    return request('/invites', {
        method: 'PUT',
        data,
    });
}

/**
 * 删除邀请
 */
export async function deleteInvite(params: any) {
    return request('/invites', {
        method: 'DELETE',
        params,
    });
}

/**
 * 获取有效邀请
 */
export async function getValidInvite(params: any) {
    return request('/invites/valid', {
        method: 'GET',
        params,
    });
}

/**
 * 根据uuid获取邀请
 */
export async function getInviteByUuid(params: any) {
    return request(`/invites/uuid`, {
        method: 'GET',
        params,
    });
}

/**
 * 接受邀请
 */
export async function acceptInvite(data: any) {
    return request('/invites/accept', {
        method: 'PUT',
        data,
    });
}
