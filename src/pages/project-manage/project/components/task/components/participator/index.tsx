import React, { useEffect, useState } from 'react';
import { Avatar, Popover, Input, Button, message } from 'antd';
import { For } from 'tsx-control-statements/components';
import styles from './index.less';
import AddMemberToProjectDialog from '@/pages/project-manage/list/components/add-member-to-project-dialog';
import { PlusCircleTwoTone, SearchOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';
import { getUserList } from '@/api';
import { cloneDeep } from 'lodash';
import { useModel } from 'umi';
import { changeTaskParticipant } from '@/api';

const Participator = ({ currentTask = {}, currentProject = {} }) => {
    const [users, setUsers] = useState<any[]>([]);

    // 添加成员显示隐藏
    const [addMemberVisible, setAddMemberVisible] = useState<boolean>(false);
    const { initialState } = useModel('@@initialState');

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [dataList, setDataList] = useState([]);
    const [executor, setExecutor] = useState({ id: 0, username: '待认领' });
    // 初始人员数据列表
    const [initialDataList, setInitialDataList] = useState([]);

    const userInfo: any = initialState || {};
    // 自增刷新
    const [refresh, setRefresh] = useState(0);

    const isManager = userInfo.id === currentProject?.manager_id;

    // 已经成为参与者的项目成员不展示
    const filterDataList = (dataList: any[]) => {
        return dataList.filter((item) => !users.some((user) => user.id === item.id));
    };

    useEffect(() => {
        if (currentProject?.id) {
            getList();
        }
    }, [currentProject]);

    useEffect(() => {
        let rows: any = cloneDeep(initialDataList) || [];
        setDataList([...rows]);
    }, [executor, initialDataList]);

    const setHide = () => {
        setVisible(false);
    };

    const keywordChange = () => {
        setTimeout(getList, 300);
    };

    const getList = async () => {
        const {
            data: { rows },
        } = await getUserList({ keyword: name, project_id: currentProject.id });
        setInitialDataList(rows);
    };
    const selectHandler = async (user: any, isAdd: boolean) => {
        // 不可删除创建者
        if (!isAdd && user.id === currentTask.creator_id) {
            message.error('不可删除创建者');
            return;
        }
        const { code } = await changeTaskParticipant({
            task_id: currentTask.id,
            user_id: user.id,
        });
        if (code === 200) {
            if (isAdd) {
                setUsers([...users, user]);
            } else {
                setUsers(users.filter((item) => item.id !== user.id));
            }
        }
    };
    useEffect(() => {
        if (!visible) {
            setName('');
        }
    }, [visible]);

    const handleAddUser = () => {
        setAddMemberVisible(true);
    };

    // 添加成员完成或者退出事件
    const handleAddMemberFinish = (type: 'success' | 'quit') => {
        setAddMemberVisible(false);
    };

    useEffect(() => {
        if (currentTask?.participators) {
            setUsers(currentTask.participators);
        }
    }, [currentTask]);
    return (
        <div className={styles['participator']}>
            <div className={styles['title']}>
                参与者 <span className={styles['point']}></span>
                {users.length}
            </div>
            <div className={styles['user-list']}>
                <For each="item" of={users}>
                    <Avatar key={item.id} src={item.avatar} style={{ marginRight: '8px' }} />
                </For>
                <Popover
                    content={
                        <div className={styles['popover-content-executor-selector']}>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="搜索"
                                prefix={<SearchOutlined />}
                                onKeyUp={keywordChange}
                            />
                            <div className={styles['wrap-current-executor']}>
                                <div className={styles.title}>执行者</div>
                                <For each="user" of={users}>
                                    <div
                                        onClick={() => selectHandler(user)}
                                        className={styles['current-executor']}
                                    >
                                        <div className={styles['wrap-info']}>
                                            <Avatar
                                                size="small"
                                                src={user.avatar || ''}
                                                icon={<UserOutlined />}
                                            />
                                            <span className={styles.name}>{user.username}</span>
                                        </div>
                                        <CheckOutlined />
                                    </div>
                                </For>
                                <div className={styles.title}>其他成员</div>
                                {filterDataList(initialDataList)?.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`${styles['current-executor']} ${styles['disabled-custom']}`}
                                        onClick={() => selectHandler(user, true)}
                                    >
                                        <div className={styles['wrap-info']}>
                                            <Avatar
                                                className={styles['user-avatar']}
                                                size="small"
                                                src={user.avatar || ''}
                                                icon={<UserOutlined />}
                                            />
                                            <span className={styles.name}>{user.username}</span>
                                        </div>
                                        {executor.id === user.id && <CheckOutlined />}
                                    </div>
                                ))}
                            </div>
                            <div className={styles['wrap-footer']}>
                                <Button
                                    type="primary"
                                    style={{ width: '100%' }}
                                    onClick={handleAddUser}
                                    disabled={!isManager}
                                >
                                    邀请新成员
                                </Button>
                            </div>
                        </div>
                    }
                    placement="bottom"
                    trigger="click"
                >
                    <PlusCircleTwoTone className={styles['icon']} />
                </Popover>
            </div>
            <AddMemberToProjectDialog
                project={currentProject}
                handleAddMemberFinish={handleAddMemberFinish}
                addMemberVisible={addMemberVisible}
            />
        </div>
    );
};

export default Participator;
