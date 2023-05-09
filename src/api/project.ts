import { request } from 'umi';

/**
 * 获取项目列表
 */
export async function getProjectList(params) {
    return request('/projects/list', {
        method: 'GET',
        params,
    });
}
