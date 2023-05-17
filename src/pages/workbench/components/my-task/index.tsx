import React, { useState, useEffect } from 'react';
import { Tabs, Tag, Pagination, Select, Spin } from 'antd';
import { getTaskList, getTaskPriorityList } from '@/api';
import EmptyImage from '@/components/empty-image';
import styles from './index.less';
import { useModel, history } from 'umi';
import { UnorderedListOutlined, UsergroupAddOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const MyTask = () => {
    const { initialState } = useModel('@@initialState');
    const userInfo: any = initialState || {};
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState({});
    const [navActiveName, setNavActiveName] = useState('execute');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // 任务列表请求参数
    const [taskListParams, setTaskListParams] = useState<any>({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        is_done: 0,
        is_recycle: 0,
    });

    const taskDoneStates = [
        {
            id: 0,
            color: '#7c7c7c',
            icon: 'iconfont icon-fangxing1',
            name: '未完成',
        },
        {
            id: 1,
            color: '#1ae54d',
            icon: 'iconfont icon-xuanzhong2',
            name: '已完成',
        },
    ];

    useEffect(() => {
        init();
    }, [taskListParams, navActiveName]);

    const getList = () => {
        const body: any = {};
        switch (navActiveName) {
            case 'execute':
                body.executor_ids = [userInfo.id];
                break;
            case 'participation':
                body.participator_id = userInfo.id;
                break;
            case 'created':
                body.creator_id = userInfo.id;
                break;
            default:
                break;
        }
        return getTaskList({
            ...taskListParams,
            ...body,
        });
    };

    const init = async () => {
        setLoading(true);
        const { data: taskPriorityData } = await getTaskPriorityList();
        const { data } = await getList();
        setLoading(false);

        data.rows.forEach((task) => {
            task.priority = taskPriorityData?.rows?.find(
                (priority) => priority.id === task.task_priority_id
            );
            return task;
        });

        setTaskData(data);
    };

    const handleCurrentChange = (val) => {
        setCurrentPage(val);
        setTaskListParams({ ...taskListParams, offset: (val - 1) * pageSize });
    };

    const taskDoneStatesChange = (value) => {
        setTaskListParams({ ...taskListParams, is_done: value });
    };
    const goToProject = (project) => {
        history.push(`/project-manage/project/${project.id}`);
    };

    const goToTask = (task) => {
        // Implement the navigation to the task page
    };

    return (
        <div className={styles['my-task']}>
            <div className={styles.head}>
                <div className={styles.title}>我的任务 - {taskData.count}</div>
                <div className={styles['wrap-ctrl']}>
                    <Select
                        value={taskListParams.is_done}
                        placeholder="请选择"
                        style={{ width: 100 }}
                        onChange={taskDoneStatesChange}
                    >
                        {taskDoneStates.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className={styles['wrap-nav']}>
                <Tabs activeKey={navActiveName} onChange={setNavActiveName}>
                    <TabPane
                        tab={
                            <>
                                <UnorderedListOutlined /> 我执行的
                            </>
                        }
                        key="execute"
                    />
                    <TabPane
                        tab={
                            <>
                                <UsergroupAddOutlined /> 我参与的
                            </>
                        }
                        key="participation"
                    />
                    <TabPane
                        tab={
                            <>
                                <PlusCircleOutlined /> 我创建的
                            </>
                        }
                        key="created"
                    />
                </Tabs>
            </div>
            <div className={styles['wrap-task-list']}>
                <Spin spinning={loading}>
                    {taskData.rows &&
                        taskData.rows.map((item) => (
                            <div
                                key={item.id}
                                className={styles['task-item']}
                                onClick={() => goToProject(item.project)}
                            >
                                <Tag
                                    style={{
                                        color: item?.priority?.color,
                                        borderColor: item?.priority?.color,
                                    }}
                                >
                                    {item?.priority?.name}
                                </Tag>
                                <div className={styles['task-name']} onClick={() => goToTask(item)}>
                                    {item.name}
                                </div>
                                <div className={styles['project-name']}>
                                    {item.project && item.project.name}
                                </div>
                            </div>
                        ))}
                    {!loading && !(taskData.rows && taskData.rows.length) && (
                        <EmptyImage height={510} heightImg={160} text="空空如也~~" />
                    )}
                </Spin>
            </div>
            <div className={styles['wrap-pagination']}>
                {taskData.count > pageSize && (
                    <Pagination
                        current={currentPage}
                        total={taskData.count}
                        pageSize={pageSize}
                        onChange={handleCurrentChange}
                    />
                )}
            </div>
        </div>
    );
};

export default MyTask;
