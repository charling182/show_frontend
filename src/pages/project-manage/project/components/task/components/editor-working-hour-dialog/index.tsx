import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Modal, DatePicker, InputNumber, Input, message } from 'antd';
import dayjs from 'dayjs';
import ExecutorSelect from '@/components/executor-select';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { createTaskWorkTime, updateTaskWorkTime } from '@/api';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const EditorWorkingHourDialog = ({
    currentTask,
    currentProject,
    selectedWorkHour,
    workHourDialogVisible = false,
    isCurrentProjectMember = false,
    handleWorkHourSuccess,
}) => {
    // 当前工时信息
    const [currentWorkHour, setCurrentWorkHour] = useState<any>({
        start_date: dayjs().format('YYYY-MM-DD'),
        work_time: 1,
        executor_id: 1,
    });

    const executorSelect = (user: any) => {
        setCurrentWorkHour({ ...currentWorkHour, executor_id: user.id });
    };

    const handleCancel = () => {
        handleWorkHourSuccess('quit');
    };

    const handleOk = async () => {
        if (!currentWorkHour.work_time) {
            message.warning('工时数不能为空');
            return;
        }
        const data: any = {
            ...currentWorkHour,
            task_id: currentTask?.id,
            project_id: currentProject?.id,
        };
        if (selectedWorkHour?.id) {
            const { code } = await updateTaskWorkTime(data);
            if (code === 200) {
                message.success('任务工时编辑成功');
                handleWorkHourSuccess('success');
            }
        } else {
            const { code } = await createTaskWorkTime(data);
            if (code === 200) {
                message.success('任务工时添加成功');
                handleWorkHourSuccess('success');
            }
        }
    };

    const handleTimeChange = (date: any, dateString: string) => {
        console.log(date, dateString);

        setCurrentWorkHour({ ...currentWorkHour, start_date: dateString });
    };

    useEffect(() => {
        if (workHourDialogVisible && selectedWorkHour?.id) {
            setCurrentWorkHour({ ...currentWorkHour, ...selectedWorkHour });
        }
    }, [selectedWorkHour, workHourDialogVisible]);
    return (
        <Modal
            title={selectedWorkHour?.id ? '实际工时' : '实际工时录入'}
            open={workHourDialogVisible}
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <div className={styles['editor-modal']}>
                <div className={styles['form-item']}>
                    <div className={styles['label']}>工时执行者:</div>
                    <ExecutorSelect
                        currentProject={currentProject}
                        executorId={currentWorkHour?.executor_id}
                        isCurrentProjectMember={isCurrentProjectMember}
                        showNoOne={true}
                        onSelect={executorSelect}
                    />
                </div>
                <div className={styles['form-item']}>
                    <div className={styles['label']}>日期:</div>
                    <DatePicker
                        value={
                            currentWorkHour?.start_date ? dayjs(currentWorkHour.start_date) : null
                        }
                        format="YYYY-MM-DD"
                        onChange={handleTimeChange}
                    />
                </div>
                <div className={styles['form-item']}>
                    <div className={styles['label']}>实际工时数:</div>
                    <InputNumber
                        value={currentWorkHour?.work_time}
                        style={{ width: '100%' }}
                        onChange={(value: any) => {
                            setCurrentWorkHour({ ...currentWorkHour, work_time: value });
                        }}
                    />
                </div>
                <div className={styles['form-item']}>
                    <div className={styles['label']}>工作进展:</div>
                    <Input.TextArea
                        value={currentWorkHour?.description}
                        onChange={(e: any) => {
                            setCurrentWorkHour({ ...currentWorkHour, description: e.target.value });
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditorWorkingHourDialog;
