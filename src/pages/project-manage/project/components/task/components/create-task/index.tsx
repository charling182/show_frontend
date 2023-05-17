import React, { useState } from 'react';
import { Dropdown, Button, Input, Menu, Space, message } from 'antd';
import { DownOutlined, CheckOutlined } from '@ant-design/icons';
import ExecutorSelect from '@/components/executor-select';
import styles from './index.less';
import { useModel } from 'umi';
import { IconFont } from '@/components/iconfont';
import { createTask } from '@/api';

const { TextArea } = Input;
const CreateTask = ({
    currentProject,
    handleCreateTaskSuccess,
    isCurrentProjectMember,
    currentTaskListObj,
}) => {
    // 从useTask中获取任务类型等数据
    const {
        taskStatusList: taskStates,
        taskTypeList: taskTypes,
        taskPrioritysList: taskPrioritys,
    } = useModel('useTask');

    const [name, setName] = useState('');
    const [taskTypeSelect, setTaskTypeSelect] = useState({});
    const [executor, setExecutor] = useState({ id: 0 });

    React.useEffect(() => {
        setTaskTypeSelect(taskTypes[0]);
    }, [taskTypes]);

    const menu = (
        <Menu>
            {taskTypes.map((item) => (
                <Menu.Item key={item.id} onClick={() => commandTaskType(item)}>
                    <span>
                        <IconFont
                            type={item.icon}
                            style={{ color: item.color, fontSize: '16px' }}
                        />
                        <span style={{ margin: '0 4px' }}>{item.name}</span>
                    </span>
                    {taskTypeSelect.id === item.id && <CheckOutlined />}
                </Menu.Item>
            ))}
        </Menu>
    );

    const commandTaskType = (taskType) => {
        setTaskTypeSelect(taskType);
    };

    const executorSelect = (user) => {
        setExecutor(user);
    };
    const onCancelClick = () => {
        handleCreateTaskSuccess('quit');
    };

    const commitClick = async () => {
        // name不可以为空,并给出提示
        if (!name) {
            message.warning('任务标题不可以为空');
            return;
        }
        const { code } = await createTask({
            name,
            task_list_id: currentTaskListObj.id,
            task_type_id: taskTypeSelect.id,
            task_state_id: taskStates[0].id,
            task_priority_id: taskPrioritys[0].id,
            executor_id: executor.id,
            project_id: currentProject.id,
        });
        if (code === 200) {
            message.success('任务创建成功');
            handleCreateTaskSuccess('success');
            setExecutor({ id: 0 });
            setName('');
        }
    };

    return (
        <div className={styles['create-task']}>
            <Dropdown overlay={menu} trigger={['click']}>
                <span className={styles['el-dropdown-link']}>
                    <IconFont
                        type={taskTypeSelect?.icon}
                        style={{ color: taskTypeSelect?.color, fontSize: '16px' }}
                    />
                    <span style={{ margin: '0 4px' }}>{taskTypeSelect?.name}</span>
                    <DownOutlined />
                </span>
            </Dropdown>
            <div className={styles['wrap-item']}>
                <TextArea
                    rows={3}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入标题"
                />
            </div>
            <div className={styles['wrap-item']}>
                <ExecutorSelect
                    currentProject={currentProject}
                    executorId={executor.id}
                    isCurrentProjectMember={isCurrentProjectMember}
                    showNoOne={true}
                    onSelect={executorSelect}
                />
            </div>
            <Space
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className={styles['wrap-item']}
            >
                <Button onClick={onCancelClick}>取消</Button>
                <Button type="primary" onClick={commitClick}>
                    创建
                </Button>
            </Space>
        </div>
    );
};

export default CreateTask;
