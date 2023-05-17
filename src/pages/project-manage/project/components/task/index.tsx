import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import {
    MoreOutlined,
    PlusOutlined,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { getTaskLists, recycleAllTaskOfTaskList, deleteTaskList } from '@/api';
import CreateTaskList from './components/create-task-list';
import { useModel } from 'umi';
import CreateTask from './components/create-task';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import List from './components/task-list';
import EditorTaskListDialog from './components/editor-task-list-dialog';

const TaskList = ({ currentProject }) => {
    const { initialState } = useModel('@@initialState');
    const userInfo: any = initialState;
    // 判断当前登录人是否为项目成员
    const isCurrentProjectMember = currentProject?.member?.some(
        (item: any) => item.id === userInfo.id
    );

    const [listData, setListData] = useState<any[]>([]);
    // 刷新自增
    const [refresh, setRefresh] = useState(0);
    const [indexListCreate, setIndexListCreate] = useState(-1);
    // 任务列表编辑开关
    const [editorTaskListDialogVisible, setEditorTaskListDialogVisible] = useState(false);
    // 选中的任务列表数据
    const [selectedTaskList, setSelectedTaskList] = useState<any>({});
    // 任务列表移动至回收站,或者删除任务列表成功后刷新
    const [refreshTaskList, setRefreshTaskList] = useState(0);
    // 一个map,键名为任务列表id,键值为任务列表中的任务数量
    const [taskListTaskCountMap, setTaskListTaskCountMap] = useState<any>({});
    // 任务列表编辑成功
    const handleEditorTaskListDialogSuccess = (type: 'quit' | 'success') => {
        if (type === 'success') {
            setRefresh(refresh + 1);
            setRefreshTaskList(refreshTaskList + 1);
        }
        setEditorTaskListDialogVisible(false);
    };
    // 任务列表创建成功
    const handleCreateSuccess = () => {
        setRefresh(refresh + 1);
    };
    // 任务创建成功
    const handleCreateTaskSuccess = (type: 'success' | 'quit') => {
        setIndexListCreate(-1);
        setRefresh(refresh + 1);
        setRefreshTaskList(refreshTaskList + 1);
    };
    // 任务移至回收站事件
    const handleTaskMoveToRecycleBinSuccess = async (item: any) => {
        const { code } = await recycleAllTaskOfTaskList({ task_list_id: item.id });
        if (code === 200) {
            setRefreshTaskList(refreshTaskList + 1);
            setRefresh(refresh + 1);
            message.success('任务移至回收站成功');
        }
    };
    // 任务列表删除事件
    const handleTaskListDeleteSuccess = async (item: any) => {
        const { code } = await deleteTaskList({ ids: [item.id] });
        if (code === 200) {
            setRefreshTaskList(refreshTaskList + 1);
            setRefresh(refresh + 1);
            message.success('任务列表删除成功');
        }
    };
    const commandMore = ({ key }: any, item: any, index: number) => {
        setSelectedTaskList(item);
        if (key === '1') {
            setEditorTaskListDialogVisible(true);
        } else if (key === '2') {
            // 任务列表移至回收站
            handleTaskMoveToRecycleBinSuccess(item);
        } else if (key === '3') {
            // 删除任务列表
            handleTaskListDeleteSuccess(item);
        }
    };
    const taskOpen = () => {};
    const CreateTaskClick = (itemList: any, indexList: number, e: any) => {
        e.currentTarget.blur();
        setIndexListCreate(indexList);
    };
    const cancelClick = () => {};
    const createSuccess = () => {};

    const init = async () => {
        const {
            code,
            data: { rows },
        } = await getTaskLists({ project_id: currentProject.id, limit: 1000, offset: 0 });
        if (code === 200) {
            const map: any = {};
            rows.forEach((item: any) => {
                map[item.id] = 0;
            });
            setTaskListTaskCountMap(map);

            setListData(rows);
        }
    };

    useEffect(() => {
        if (currentProject.id) {
            init();
        }
    }, [currentProject, refresh]);

    return (
        <div className={styles['task-list']}>
            {listData.map((itemList, indexList) => (
                <div key={indexList} className={styles['wrap-item']}>
                    <div className={styles['task-list-info']}>
                        <div className={styles.name}>
                            {itemList.name}
                            <span className={styles['name-point']}></span>
                            {itemList.tasks
                                ? itemList.tasks.filter((i) => i.is_recycle === 0).length
                                : 0}
                        </div>
                        <div className={styles.more}>
                            <Dropdown
                                dropdownRender={() => (
                                    <Menu onClick={(e) => commandMore(e, itemList, indexList)}>
                                        <Menu.Item className={styles['menu-item']} key="1">
                                            <EditOutlined />
                                            <span className={styles['menu-item-title']}>
                                                编辑列表
                                            </span>
                                        </Menu.Item>
                                        <Menu.Item className={styles['menu-item']} key="2">
                                            <DeleteOutlined />
                                            <span className={styles['menu-item-title']}>
                                                本列所有任务移至回收站
                                            </span>
                                        </Menu.Item>
                                        <Menu.Item className={styles['menu-item']} key="3">
                                            <DeleteOutlined />
                                            <span className={styles['menu-item-title']}>
                                                删除该列所有内容
                                            </span>
                                        </Menu.Item>
                                    </Menu>
                                )}
                            >
                                <EllipsisOutlined />
                            </Dropdown>
                        </div>
                    </div>
                    <List
                        refreshTaskList={refreshTaskList}
                        taskListObj={itemList}
                        isCurrentProjectMember={isCurrentProjectMember}
                        currentProject={currentProject}
                    />
                    <Choose>
                        <When condition={indexListCreate !== indexList}>
                            <Button
                                block
                                icon={<PlusOutlined style={{ color: '#ccc' }} />}
                                onClick={(e) => CreateTaskClick(itemList, indexList, e)}
                                disabled={!isCurrentProjectMember}
                            ></Button>
                        </When>
                        <Otherwise>
                            <CreateTask
                                currentTaskListObj={itemList}
                                handleCreateTaskSuccess={handleCreateTaskSuccess}
                                isCurrentProjectMember={isCurrentProjectMember}
                                currentProject={currentProject}
                            />
                        </Otherwise>
                    </Choose>
                </div>
            ))}
            <CreateTaskList
                currentProject={currentProject}
                handleCreateSuccess={handleCreateSuccess}
            />
            <EditorTaskListDialog
                selectedTaskList={selectedTaskList}
                editorTaskListDialogVisible={editorTaskListDialogVisible}
                handleEditorTaskListDialogSuccess={handleEditorTaskListDialogSuccess}
            />
        </div>
    );
};

export default TaskList;
