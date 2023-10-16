import React, { useState } from 'react';
import { Popover, Form, Input, Select, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel } from 'umi';

const { Option } = Select;

const TaskFilter = ({
    projectMembers = [],
    taskListSearchCondition = {},
    setTaskListSearchCondition,
}) => {
    const { taskPrioritysList, taskStatusList } = useModel('useTask');
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const optionsDone = [
        {
            value: -1,
            label: '全部',
        },
        {
            value: 1,
            label: '是',
        },
        {
            value: 0,
            label: '否',
        },
    ];

    const handleSearch = () => {
        const values = form.getFieldsValue();
        setTaskListSearchCondition({ ...values });
        console.log('values', values);

        // setVisible(false);
    };

    const handleReset = () => {
        form.resetFields();
    };

    const content = (
        <div className={styles['task-filter-wrap-content']}>
            <Form
                defaultValue={taskListSearchCondition}
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Form.Item label="标题" name="name">
                    <Input placeholder="搜索任务标题" />
                </Form.Item>
                <Form.Item label="执行者" name="executor_ids">
                    <Select mode="multiple" placeholder="请选择">
                        {projectMembers.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.username}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="创建者" name="creator_ids">
                    <Select mode="multiple" placeholder="请选择">
                        {projectMembers.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.username}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="是否完成" name="is_done">
                    <Select placeholder="请选择">
                        {optionsDone.map((item) => (
                            <Option key={item.value} value={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="优先级" name="task_priority_ids">
                    <Select mode="multiple" placeholder="请选择">
                        {taskPrioritysList.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="执行状态" name="task_state_ids">
                    <Select mode="multiple" placeholder="请选择">
                        {taskStatusList.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Space>
                        <Button type="primary" onClick={handleSearch}>
                            搜索
                        </Button>
                        <Button onClick={handleReset}>重置</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );

    return (
        <div className={styles['task-filter']}>
            <Popover
                placement="bottom"
                content={content}
                trigger="click"
                open={visible}
                onOpenChange={setVisible}
            >
                <Button icon={<SearchOutlined />} type="link" size="small">
                    筛选
                </Button>
            </Popover>
        </div>
    );
};

export default TaskFilter;
