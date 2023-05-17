import React, { useEffect, useState } from 'react';
import styles from './index.less';
import TaskItem from '../task-item';
import { getTaskList } from '@/api';
import { For, If } from 'tsx-control-statements/components';
import { groupBy } from 'lodash';

const TaskList = ({ taskListObj, refreshTaskList, isCurrentProjectMember, currentProject }) => {
    // 已完成任务列表
    const [doneTaskList, setDoneTaskList] = useState<any[]>([]);
    // 未完成任务列表
    const [undoneTaskList, setUndoneTaskList] = useState<any[]>([]);
    // 自增刷新
    const [refresh, setRefresh] = useState(0);

    // 任务状态更新成功事件
    const handleTaskUpdateSuccess = () => {
        setRefresh(refresh + 1);
    };

    const init = async () => {
        const {
            code,
            data: { rows, count },
        } = await getTaskList({ task_list_id: taskListObj.id, limit: 1000, offset: 0 });
        if (code === 200) {
            const taskDoneGroup = groupBy(rows, 'is_done');
            setUndoneTaskList(taskDoneGroup['0'] || []);
            setDoneTaskList(taskDoneGroup['1'] || []);
        }
    };

    useEffect(() => {
        if (taskListObj.id) {
            init();
        }
    }, [taskListObj.id, refresh, refreshTaskList]);
    return (
        <div className={styles['task-list']}>
            <For each="item" of={undoneTaskList}>
                <If condition={item.is_recycle === 0}>
                    <TaskItem
                        element={item}
                        currentProject={currentProject}
                        isCurrentProjectMember={isCurrentProjectMember}
                        handleTaskUpdateSuccess={handleTaskUpdateSuccess}
                    />
                </If>
            </For>
            <For each="item" of={doneTaskList}>
                <If condition={item.is_recycle === 0}>
                    <TaskItem
                        element={item}
                        currentProject={currentProject}
                        isCurrentProjectMember={isCurrentProjectMember}
                        handleTaskUpdateSuccess={handleTaskUpdateSuccess}
                    />
                </If>
            </For>
        </div>
    );
};

export default TaskList;
