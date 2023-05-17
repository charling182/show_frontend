import React, { useEffect, useState } from 'react';
import { getTaskStatusList, getTaskTypeList, getTaskPrioritysList, getTaskTagsList } from '@/api';

const UseSocket = () => {
    // 任务状态列表
    const [taskStatusList, setTaskStatusList] = useState([]);
    // 任务类型列表
    const [taskTypeList, setTaskTypeList] = useState([]);
    // 任务优先级列表
    const [taskPrioritysList, setTaskPrioritysList] = useState([]);
    // 任务标签列表
    const [taskTagsList, setTaskTagsList] = useState([]);

    // 使用promise.all获取所有任务状态、类型、优先级列表
    useEffect(() => {
        Promise.all([
            getTaskStatusList(),
            getTaskTypeList(),
            getTaskPrioritysList(),
            getTaskTagsList(),
        ]).then((res) => {
            setTaskStatusList(res[0] && res[0]['data'] && res[0]['data']['rows']);
            setTaskTypeList(res[1] && res[1]['data'] && res[1]['data']['rows']);
            setTaskPrioritysList(res[2] && res[2]['data'] && res[2]['data']['rows']);
            setTaskTagsList(res[3] && res[3]['data'] && res[3]['data']['rows']);
        });
    }, []);
    return {
        taskStatusList,
        taskTypeList,
        taskPrioritysList,
        taskTagsList,
    };
};

export default UseSocket;
