import React, { useState, useEffect } from 'react';
import {
    ClockCircleOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    Space,
} from '@ant-design/icons';
import { Button, Avatar, message } from 'antd';
import { For, If } from 'tsx-control-statements/components';
import dayjs from 'dayjs';
import EditorWorkingHourDialog from '../editor-working-hour-dialog';
import { getTaskWorkTime, deleteTaskWorkTime } from '@/api';

import styles from './index.less';

const WorkHour = ({ currentTask, currentProject, isCurrentProjectMember = false }) => {
    // 选中的工时信息
    const [selectedWorkHour, setSelectedWorkHour] = useState<any>({});
    // 工时编辑弹窗开关
    const [workHourDialogVisible, setWorkHourDialogVisible] = useState(false);
    // 工时列表
    const [workHourList, setWorkHourList] = useState<any[]>([]);
    // 自增刷新
    const [refresh, setRefresh] = useState(0);

    const handleAddWorkingHour = (e: any) => {
        e.currentTarget.blur();
        setWorkHourDialogVisible(true);
    };

    const editClick = (item: any, e: any) => {
        e.currentTarget.blur();
        setSelectedWorkHour(item);
        setWorkHourDialogVisible(true);
    };
    const deleteClick = async (item: any, e: any) => {
        e.currentTarget.blur();
        console.log('删除工时', item);
        const { code } = await deleteTaskWorkTime({ ids: [item.id] });
        if (code === 200) {
            setRefresh(refresh + 1);
            message.success('删除成功');
        }
    };

    const startDateFormat = (work_time: string) => {
        if (new Date(work_time).getFullYear() === new Date().getFullYear()) {
            return dayjs(work_time).format('M月D日');
        }
        return dayjs(work_time).format('YYYY年M月D日');
    };

    // 获取任务工时列表
    const getTaskWorkTimeList = async () => {
        const {
            code,
            data: { rows },
        } = await getTaskWorkTime({
            task_id: currentTask.id,
        });
        if (code === 200) {
            setWorkHourList(rows);
        }
    };

    const handleWorkHourSuccess = (type: 'quit' | 'success') => {
        if (type === 'success') {
            setRefresh(refresh + 1);
        }
        setWorkHourDialogVisible(false);
    };

    useEffect(() => {
        if (currentTask.id) {
            getTaskWorkTimeList();
        }
    }, [currentTask.id, refresh]);

    return (
        <div className={styles['working-hour']}>
            <div className={styles['label']}>
                <span className={styles['title']}>
                    <ClockCircleOutlined className={styles['iconfont']} />
                    工时
                </span>
            </div>
            <div className={styles['content']}>
                <Button
                    type="text"
                    className={styles['btn-add-working-hour']}
                    icon={<PlusOutlined />}
                    onClick={handleAddWorkingHour}
                >
                    添加实际工时
                </Button>
                <div className={styles['wrap-working-hour-list']}>
                    <For each="item" of={workHourList} index="index">
                        <div className={styles['item']}>
                            <div className={styles['wrap-working-hour-content']}>
                                <Avatar
                                    src={item.executor ? item.executor.avatar : ''}
                                    style={{ width: '26px', height: '26px' }}
                                />
                                <div>
                                    <div className={styles['wrap-info']}>
                                        <span className={styles['name']}>
                                            {item.executor && item.executor.username}
                                        </span>
                                        <span className={styles['start-date']}>
                                            {startDateFormat(item.start_date)}
                                        </span>
                                        实际工时为 {item.work_time} 小时
                                    </div>
                                    <If condition={item.description}>
                                        <div className={`${styles['description']}`}>
                                            {item.description}
                                        </div>
                                    </If>
                                </div>
                            </div>
                            <div className={styles['ctrl']}>
                                <Button
                                    className={styles['icon']}
                                    icon={<EditOutlined />}
                                    type="text"
                                    onClick={(e) => editClick(item, e)}
                                />
                                <Button
                                    className={styles['icon']}
                                    icon={<DeleteOutlined />}
                                    type="text"
                                    onClick={(e) => deleteClick(item, e)}
                                />
                            </div>
                        </div>
                    </For>
                </div>
            </div>
            <EditorWorkingHourDialog
                currentTask={currentTask}
                currentProject={currentProject}
                isCurrentProjectMember={isCurrentProjectMember}
                selectedWorkHour={selectedWorkHour}
                workHourDialogVisible={workHourDialogVisible}
                handleWorkHourSuccess={handleWorkHourSuccess}
            />
        </div>
    );
};

export default WorkHour;
