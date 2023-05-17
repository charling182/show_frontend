import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Popover, Avatar } from 'antd';
import {
    SearchOutlined,
    CheckOutlined,
    QuestionCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { getUserList } from '@/api';
import styles from './index.less';
import { useModel } from 'umi';
import { cloneDeep } from 'lodash';
import AddMemberToProjectDialog from '@/pages/project-manage/list/components/add-member-to-project-dialog';

const ExecutorSelect = ({
    isCurrentProjectMember = false,
    executorId,
    currentProject,
    showAddUser = true,
    showNoOne = false,
    onSelect,
}) => {
    const { initialState } = useModel('@@initialState');

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [dataList, setDataList] = useState([]);
    const [executor, setExecutor] = useState({ id: 0, username: '待认领' });
    // 初始人员数据列表
    const [initialDataList, setInitialDataList] = useState([]);

    const userInfo: any = initialState || {};
    const noOne = {
        id: 0,
        username: '待认领',
    };
    // 自增刷新
    const [refresh, setRefresh] = useState(0);
    // 添加成员显示隐藏
    const [addMemberVisible, setAddMemberVisible] = useState<boolean>(false);

    const isManager = userInfo.id === currentProject?.manager_id;

    useEffect(() => {
        if (currentProject?.id) {
            getList();
        }
    }, [executorId, currentProject]);

    useEffect(() => {
        let rows: any = cloneDeep(initialDataList) || [];
        // 如果需要增加待认领项
        rows = rows.filter((user) => user.id !== executor.id);
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
        showNoOne ? setInitialDataList([...rows, noOne]) : setInitialDataList(rows);
    };

    const selectHandler = (user) => {
        setExecutor(user);
        onSelect(user);
        setHide();
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
    const content = (
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
                <div className={styles['current-executor']}>
                    <div className={styles['wrap-info']}>
                        <Avatar
                            className={styles['user-avatar']}
                            size="small"
                            src={executor.avatar || ''}
                            icon={<UserOutlined />}
                        />
                        <span className={styles.name}>{executor.username}</span>
                    </div>
                    <CheckOutlined />
                </div>
                <div className={styles.title}>其他成员</div>
                {dataList?.map((user) => (
                    <div
                        key={user.id}
                        className={`${styles['current-executor']} ${styles['disabled-custom']}`}
                        onClick={() => selectHandler(user)}
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
            {showAddUser && isManager && (
                <div className={styles['wrap-footer']}>
                    <Button type="primary" style={{ width: '100%' }} onClick={handleAddUser}>
                        邀请新成员
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className={styles['executor-select']}>
            <Popover
                content={content}
                title="执行者"
                trigger="click"
                open={visible}
                onOpenChange={setVisible}
            >
                <Button type="text" disabled={!isCurrentProjectMember} className={styles.btn}>
                    <Avatar
                        className={styles['user-avatar']}
                        size="small"
                        src={executor.avatar || ''}
                        icon={<UserOutlined />}
                    />
                    {executor.username}
                    <QuestionCircleOutlined />
                </Button>
            </Popover>
            <AddMemberToProjectDialog
                project={currentProject}
                handleAddMemberFinish={handleAddMemberFinish}
                addMemberVisible={addMemberVisible}
            />
        </div>
    );
};

export default ExecutorSelect;
