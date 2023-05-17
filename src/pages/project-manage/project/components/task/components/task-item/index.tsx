import React, { useState, useEffect } from 'react';
import { Tooltip, Button, Avatar, message } from 'antd';
import styles from './index.less';
import { useModel } from 'umi';
import { IconFont } from '@/components/iconfont';
import { updateTask } from '@/api';
import TaskDialog from '../task-dialog';

const TaskDraggableItem = ({
    element,
    isCurrentProjectMember = false,
    handleTaskUpdateSuccess,
    currentProject = {},
}) => {
    const { taskPrioritysList, taskStatusList, taskTypeList }: any = useModel('useTask');
    const [task, setTask] = useState(element);
    // 任务详情弹窗开关
    const [taskDialogVisible, setTaskDialogVisible] = useState(false);

    // 任务详情编辑成功
    const handleTaskDialogSuccess = (type: 'quit' | 'success') => {
        if (type === 'success') {
            handleTaskUpdateSuccess();
        }
        if (type === 'quit') {
            setTaskDialogVisible(false);
        }
    };

    // 获得任务优先级颜色
    const getTaskPriority = (task_priority_id: number) => {
        if (task_priority_id && taskPrioritysList.length) {
            return taskPrioritysList?.find((item: any) => item.id === element.task_priority_id);
        }
        return '';
    };
    // 获得任务状态信息
    const getTaskStateInfo = (task_state_id: number) => {
        if (task_state_id && taskStatusList.length) {
            return taskStatusList?.find((item: any) => item.id === element.task_state_id);
        }
        return {};
    };
    // 获取任务类型信息
    const getTaskTypeInfo = (task_type_id: number) => {
        if (task_type_id && taskTypeList.length) {
            return taskTypeList?.find((item: any) => item.id === element.task_type_id);
        }
        return {};
    };

    const changeDoneState = async (task: any, e: any) => {
        e.stopPropagation();
        if (!isCurrentProjectMember) {
            message.warning('您不是项目成员，无法操作');
            return;
        }
        task.is_done = task.is_done === 1 ? 0 : 1;
        const { code } = await updateTask(task);
        if (code === 200) {
            message.success('状态修改成功');
            handleTaskUpdateSuccess();
        }
    };

    const handleClickTask = () => {
        setTaskDialogVisible(true);
    };

    useEffect(() => {
        setTask({
            ...element,
            state: getTaskStateInfo(element.task_state_id),
            type: getTaskTypeInfo(element.task_type_id),
            priority: getTaskPriority(element.task_priority_id),
        });
    }, [element]);

    return (
        <>
            <div
                onClick={handleClickTask}
                className={`${styles['list-group-item']} ${
                    task?.is_done === 1 ? styles['list-group-item-done'] : ''
                }`}
            >
                <div className={styles.state}>
                    <Tooltip title={task.state && task.state.name} placement="top">
                        <IconFont
                            type={task.state && task.state.icon}
                            style={{ color: task.state && task.state.color, fontSize: '18px' }}
                        />
                    </Tooltip>
                </div>
                <div className={styles['wrap-done']}>
                    <IconFont
                        onClick={(e) => changeDoneState(task, e)}
                        type={task?.is_done === 1 ? 'xuanzhong' : 'weixuanzhong'}
                        style={{ fontSize: '18px' }}
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.name}>{task.name}</div>
                    <div className={styles.info}>
                        {task.date_tip && task.is_done !== 1 && (
                            <span
                                className={`${styles['info-item']} ${styles['task-date']} ${task.date_tip_class}`}
                            >
                                {task.date_tip}
                            </span>
                        )}
                        {task.type && (
                            <Tooltip title={task.type.name} placement="top">
                                <IconFont
                                    className={styles['info-item']}
                                    type={task.type && task.type.icon}
                                    style={{
                                        color: task.type && task.type.color,
                                        fontSize: '18px',
                                    }}
                                />
                            </Tooltip>
                        )}
                        {task.remark && (
                            <IconFont
                                className={`${styles['info-item']} ${styles['color-light']}`}
                                type="beizhu"
                                style={{ fontSize: '16px' }}
                            />
                        )}
                        {task.likers && task.likers.length > 0 && (
                            <span className={`${styles['info-item']} ${styles['color-light']}`}>
                                <IconFont type="dianzan" style={{ fontSize: '16px' }} />
                                <span style={{ paddingLeft: '5px', fontSize: '12px' }}>
                                    {task.likers.length}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.executor}>
                    {task.executor && (
                        <Tooltip title={task.executor.username} placement="top">
                            <Avatar
                                src={task.executor.avatar || ''}
                                style={{ width: '26px', height: '26px' }}
                            />
                        </Tooltip>
                    )}
                </div>
                <div
                    className={styles['task-priority']}
                    style={{ backgroundColor: getTaskPriority(task.task_priority_id)['color'] }}
                />
            </div>
            <TaskDialog
                isCurrentProjectMember={isCurrentProjectMember}
                taskDialogVisible={taskDialogVisible}
                selectedTask={task}
                handleTaskDialogSuccess={handleTaskDialogSuccess}
                currentProject={currentProject}
            />
        </>
    );
};

export default TaskDraggableItem;
