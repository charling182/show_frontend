import React, { useState, useEffect } from 'react';
import { Tabs, Tag, Pagination, Select, Spin } from 'antd';
// import { getList, permissions as taskPermissions } from '@/api/taskManagement';
// import {
//   getList as getTaskPriorityList,
//   permissions as taskPriorityPermissions,
// } from '@/api/taskPriorityManagement';
// import { getProjectList } from '@/api';
import EmptyImage from '@/components/empty-image';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

const MyTask = () => {
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState({});
    const [form, setForm] = useState({
        is_done: 0,
        is_recycle: 0,
    });
    const [navActiveName, setNavActiveName] = useState('execute');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
    }, [navActiveName, form.is_done, currentPage]);

    const init = async () => {
        setLoading(true);
        // const taskPriorityData = await getTaskPriorityList();
        // const taskData = await getList(navActiveName, currentPage, pageSize, form);
        // setLoading(false);

        // taskData.rows.forEach((task) => {
        //   task.priority = taskPriorityData.rows.find(
        //     (priority) => priority.id === task.task_priority_id,
        //   );
        //   return task;
        // });

        setTaskData(taskData);
    };

    const handleCurrentChange = (val) => {
        setCurrentPage(val);
    };

    const taskDoneStatesChange = (value) => {
        setForm({ ...form, is_done: value });
    };
    const goToProject = (project) => {
        // Implement the navigation to the project page
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
                        value={form.is_done}
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
                                <i className="iconfont icon-caidan1"></i> 我执行的
                            </>
                        }
                        key="execute"
                    />
                    <TabPane
                        tab={
                            <>
                                <i className="iconfont icon-duoren1"></i> 我参与的
                            </>
                        }
                        key="participation"
                    />
                    <TabPane
                        tab={
                            <>
                                <i className="iconfont icon-jia"></i> 我创建的
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
                            <div key={item.id} className={styles['task-item']}>
                                <Tag
                                    style={{
                                        color: item.priority.color,
                                        borderColor: item.priority.color,
                                    }}
                                >
                                    {item.priority.name}
                                </Tag>
                                <div className={styles['task-name']} onClick={() => goToTask(item)}>
                                    {item.name}
                                </div>
                                <div
                                    className={styles['project-name']}
                                    onClick={() => goToProject(item.project)}
                                >
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
