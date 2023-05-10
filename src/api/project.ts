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

/**
 * 获取某个项目
 */
export async function getOneProject(params) {
    return request('/projects', {
        method: 'GET',
        params,
    });
}

/**
 * 创建项目
 */
export async function createProject(data) {
    return request('/projects', {
        method: 'POST',
        data,
    });
}

/**
 * 更新项目
 */
export async function updateProject(data) {
    return request('/projects', {
        method: 'PUT',
        data,
    });
}

/**
 * 删除项目
 */
export async function deleteProject(params) {
    return request('/projects', {
        method: 'DELETE',
        params,
    });
}

/**
 * 获取某个项目统计
 */
export async function getProjectStatistics(params) {
    return request('/projects/statistics', {
        method: 'GET',
        params,
    });
}

/**
 * 创建项目模板
 */
export async function createProjectTemplate(data) {
    return request('/project_templates', {
        method: 'POST',
        data,
    });
}

/**
 * 更新项目模板
 */
export async function updateProjectTemplate(data) {
    return request('/project_templates', {
        method: 'PUT',
        data,
    });
}

/**
 * 获取项目模板列表
 */
export async function getProjectTemplateList(params) {
    return request('/project_templates/list', {
        method: 'GET',
        params,
    });
}

/**
 * 获取某个项目模板
 */
export async function getOneProjectTemplate(params) {
    return request('/project_templates', {
        method: 'GET',
        params,
    });
}

/**
 * 删除项目模板
 */
export async function deleteProjectTemplate(params) {
    return request('/project_templates', {
        method: 'DELETE',
        params,
    });
}

/**
 * 获取项目模板任务
 */
export async function getProjectTemplateTask(params) {
    return request('/project_template_tasks/list', {
        method: 'GET',
        params,
    });
}

/**
 * 创建项目模板任务
 */
export async function createProjectTemplateTask(data) {
    return request('/project_template_tasks', {
        method: 'POST',
        data,
    });
}

/**
 * 更新项目模板任务
 */
export async function updateProjectTemplateTask(data) {
    return request('/project_template_tasks', {
        method: 'PUT',
        data,
    });
}

/**
 * 删除项目模板任务
 */
export async function deleteProjectTemplateTask(params) {
    return request('/project_template_tasks', {
        method: 'DELETE',
        params,
    });
}

/**
 * 获取某一个项目模板任务
 */
export async function getOneProjectTemplateTask(params) {
    return request('/project_template_tasks', {
        method: 'GET',
        params,
    });
}

/**
 * 项目收藏关系改变
 */
export async function changeProjectCollect(data) {
    return request('/user_project_collects/change', {
        method: 'POST',
        data,
    });
}

/**
 * 获取用户参与的项目列表
 */
export async function getUserProjectList(params) {
    return request('/user_projects/list', {
        method: 'GET',
        params,
    });
}
