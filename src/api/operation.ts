import { request } from 'umi';

/**
 * 获取操作日志列表
 */
export async function getOperationList(params: any) {
    return request('/operation_logs/list', {
        method: 'GET',
        params,
    });
}

/**
 * 删除操作日志
 */
export async function deleteOperation(params: any) {
    return request('/operation_logs', {
        method: 'DELETE',
        params,
    });
}
