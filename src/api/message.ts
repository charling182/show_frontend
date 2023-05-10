import { request } from 'umi';

/**
 * 获取所有消息
 */
export async function getMessageList(params: any) {
    return request('/messages/list', {
        method: 'GET',
        params,
    });
}

/**
 * 获取某一个消息
 */
export async function getOneMessage(params: any) {
    return request('/messages', {
        method: 'GET',
        params,
    });
}

/**
 * 创建消息
 */
export async function createMessage(data: any) {
    return request('/messages', {
        method: 'POST',
        data,
    });
}

/**
 * 更新消息
 */
export async function updateMessage(data: any) {
    return request('/messages', {
        method: 'PUT',
        data,
    });
}

/**
 * 删除消息
 */
export async function deleteMessage(params: any) {
    return request('/messages', {
        method: 'DELETE',
        params,
    });
}
