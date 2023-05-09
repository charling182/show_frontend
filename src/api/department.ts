import { request } from 'umi';

/**
 * 创建部门
 */
export async function createDepartment(params: types.department.createDepartmentParams) {
    return request('/departments', {
        method: 'post',
        data: params,
    });
}
/**
 * 更新部门
 */
export async function updateDepartment(params: types.department.updateDepartmentParams) {
    return request('/departments', {
        method: 'put',
        data: params,
    });
}
/**
 * 获取部门列表
 */
export async function getDepartmentList(
    params: types.department.getDepartmentListParams = { offset: 0 }
) {
    return request('/departments/list', {
        method: 'get',
        params,
    });
}
/**
 * 获取部门详情
 */
export async function getOneDepartment(params: { id: number }) {
    return request('/departments', {
        method: 'get',
        params,
    });
}
/**
 * 删除部门
 */
export async function deleteDepartment(params: { ids: number[] }) {
    return request('/departments', {
        method: 'delete',
        data: params,
    });
}
