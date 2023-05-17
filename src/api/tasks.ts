import { request } from 'umi';

/**
 * 获取所有任务
 */
export async function getTaskList(params: any) {
    return request('/tasks/list', {
        method: 'GET',
        params,
    });
}

/**
 * 创建任务
 */
export async function createTask(data: any) {
    return request('/tasks', {
        method: 'POST',
        data,
    });
}

/**
 * 更新任务
 */
export async function updateTask(data: any) {
    return request('/tasks', {
        method: 'PUT',
        data,
    });
}

/**
 * 获取任务优先级列表
 */
export async function getTaskPriorityList() {
    return request('/task_prioritys/list', {
        method: 'GET',
    });
}

/**
 * 获取所有任务状态
 */
export async function getTaskStatusList() {
    return request('/task_states/list', {
        method: 'GET',
    });
}

/**
 * 获取所有任务类型
 */
export async function getTaskTypeList() {
    return request('/task_types/list', {
        method: 'GET',
    });
}

/**
 * 获取所有任务优先级
 */
export async function getTaskPrioritysList() {
    return request('/task_prioritys/list', {
        method: 'GET',
    });
}

/**
 * 获取所有任务标签
 */
export async function getTaskTagsList() {
    return request('/task_tags/list', {
        method: 'GET',
    });
}

/**
 * 新建任务列表
 */
export async function createTaskList(data: any) {
    return request('/task_lists', {
        method: 'POST',
        data,
    });
}

/**
 * 获取所有任务列表
 */
export async function getTaskLists(params: any) {
    return request('/task_lists/list', {
        method: 'GET',
        params,
    });
}

/**
 * 更新任务列表
 */
export async function updateTaskList(data: any) {
    return request('/task_lists', {
        method: 'PUT',
        data,
    });
}

/**
 * 任务列表所有任务移至回收站
 */
export async function recycleAllTaskOfTaskList(data: any) {
    return request('/tasks/recycle_all_task_of_taskList', {
        method: 'PUT',
        data,
    });
}

/**
 * 删除任务列表
 */
export async function deleteTaskList(data: any) {
    return request('/task_lists', {
        method: 'DELETE',
        data,
    });
}

/**
 * 用户任务点赞
 */
export async function userTaskLikesChange(data: any) {
    return request('/user_task_likes/change', {
        method: 'POST',
        data,
    });
}

/**
 * 获取任务工时列表
 */
export async function getTaskWorkTime(params: any) {
    return request('/task_working_hours/list', {
        method: 'GET',
        params,
    });
}

/**
 * 更新任务工时
 */
export async function updateTaskWorkTime(data: any) {
    return request('/task_working_hours', {
        method: 'PUT',
        data,
    });
}

/**
 * 创建任务工时
 */
export async function createTaskWorkTime(data: any) {
    return request('/task_working_hours', {
        method: 'POST',
        data,
    });
}

/**
 * 删除任务工时
 */
export async function deleteTaskWorkTime(data: any) {
    return request('/task_working_hours', {
        method: 'DELETE',
        data,
    });
}

/**
 * 任务参与者改变
 */
export async function changeTaskParticipant(data: any) {
    return request('/user_tasks/change', {
        method: 'POST',
        data,
    });
}

/**
 * 获取所有任务log
 */
export async function getTaskLogList(params: any) {
    return request('/task_logs/list', {
        method: 'GET',
        params,
    });
}

/**
 * 创建任务log
 */
export async function createTaskLog(data: any) {
    return request('/task_logs', {
        method: 'POST',
        data,
    });
}
