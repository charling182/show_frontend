import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Space, Avatar, Tooltip, Input, Button, Popover, message } from 'antd';
import { For, If, Choose, When, Otherwise } from 'tsx-control-statements/components';
import type { MenuProps } from 'antd';
import {
    CheckOutlined,
    DeleteOutlined,
    FieldTimeOutlined,
    UserOutlined,
    EditOutlined,
    DownOutlined,
    PlusOutlined,
    EllipsisOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { divide, find } from 'lodash';
import { getTaskLogList, createTaskLog } from '@/api';
import { dateHumanizeFormat } from '@/utils';
import LogComment from '../log-comment';
import { IconFont } from '@/components/iconfont';
import type { InputRef } from 'antd';
import { useModel } from 'umi';

import styles from './index.less';

const IconMap = {
    create: <PlusOutlined className={styles['operator-icon']} />,
    state: <PieChartOutlined className={styles['operator-icon']} />,
    edit: <EditOutlined className={styles['operator-icon']} />,
    priority: <EditOutlined className={styles['operator-icon']} />,
    executor_remove: <UserOutlined className={styles['operator-icon']} />,
    executor_claim: <UserOutlined className={styles['operator-icon']} />,
    executor_assign: <UserOutlined className={styles['operator-icon']} />,
    start_date: <FieldTimeOutlined className={styles['operator-icon']} />,
    end_date: <FieldTimeOutlined className={styles['operator-icon']} />,
    remark: <IconFont type="beizhu" className={styles['operator-icon']} />,
    is_recycle: <DeleteOutlined className={styles['operator-icon']} />,
    is_done: <CheckOutlined className={styles['operator-icon']} />,
};

const TaskLog = ({ currentTask = {}, currentProject = {} }) => {
    const [showAll, setShowAll] = useState(false);
    const { initialState } = useModel('@@initialState');
    const userInfo: any = initialState || {};
    const inputRef = useRef<InputRef>(null);
    const [showUserListPopover, setShowUserListPopover] = useState(false);
    const [content, setContent] = useState('');
    // log列表
    const [logList, setLogList] = useState([]);
    // 自增刷新
    const [refresh, setRefresh] = useState(0);

    // 选中的log类型
    const [selectedLogType, setSelectedLogType] = useState('1');

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: '所有动态',
        },
        {
            key: '2',
            label: '仅评论',
        },
        {
            key: '3',
            label: '仅动态',
        },
    ];

    const showCount: number = 5;

    const dataListFilter = () => {
        return showAll
            ? logList
            : logList.filter((item, index) => {
                  return index > logList.length - showCount - 1;
              });
    };
    const btnShowAllText = () => {
        if (logList.length <= showCount) {
            return false;
        }
        return showAll ? '隐藏较早的动态' : `显示较早的 ${logList.length - showCount} 条动态`;
    };
    const onClick = (item: any) => {
        setSelectedLogType(item.key);
    };
    const handleGetTaskLogList = async () => {
        // 判断是否为评论类型
        let params: any = {
            task_id: currentTask.id,
        };
        selectedLogType === items[1]['key'] ? (params.is_comment = 1) : null;
        const {
            code,
            data: { rows },
        } = await getTaskLogList(params);
        if (code === 200) {
            setLogList(
                rows.map((i) => {
                    return {
                        ...i,
                        created_at_humanize: dateHumanizeFormat(i.created_at).value,
                    };
                })
            );
        }
    };
    const handleContentChange = (e: any) => {
        setContent(e.target.value);
        if (/@$/.test(e.target.value) && !showUserListPopover) {
            setShowUserListPopover(true);
        }
    };

    const doCreate = async () => {
        if (content.trim() === '') {
            return;
        }

        const { code } = await createTaskLog({
            content: content,
            task_id: currentTask.id,
            project_id: currentProject.id,
            operator_id: userInfo.id,
            type: 'comment',
            is_comment: 1,
        });
        if (code === 200) {
            message.success('评论成功');
            setContent('');
            setRefresh(refresh + 1);
        }
    };
    const mentionUserSelect = (user: any) => {
        setContent(content + user.username + ' ');
        setShowUserListPopover(false);
        inputRef.current!.focus({
            cursor: 'end',
        });
    };

    const showSwitchClick = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        if (currentTask?.id && selectedLogType) {
            handleGetTaskLogList();
        }
    }, [currentTask, selectedLogType, refresh]);

    return (
        <div className={styles['task-log']}>
            <div className={styles['wrap-log']}>
                <div className={styles['wrap-filter']}>
                    <Dropdown arrow menu={{ items, onClick }}>
                        <div className={styles['dropdown-title']}>
                            <Space>
                                <span>{find(items, { key: selectedLogType })['label']}</span>
                                <DownOutlined />
                            </Space>
                        </div>
                    </Dropdown>
                </div>
                <div className={`${styles['log-list']} ${styles['color-light']}`}>
                    <If condition={btnShowAllText()}>
                        <div className={styles['btn-more']} onClick={showSwitchClick}>
                            <EllipsisOutlined />
                            {btnShowAllText()}
                        </div>
                    </If>
                    <For each="log" of={dataListFilter()}>
                        <div className={styles['item']}>
                            <div className={styles['info']}>
                                <div className={styles['info-header']}>
                                    <Choose>
                                        <When condition={log.is_comment === 0}>
                                            {IconMap[log.type]}
                                            {/* <PlusOutlined className={styles['operator-icon']} /> */}
                                        </When>
                                        <Otherwise>
                                            <Avatar
                                                className={styles['user-avatar']}
                                                src={log?.operator?.avatar || ''}
                                            />
                                        </Otherwise>
                                    </Choose>
                                    <span className={styles['username-and-remark']}>
                                        <Space>
                                            <span
                                                className={`${
                                                    log.is_comment === 1
                                                        ? styles['username-comment']
                                                        : ''
                                                }`}
                                            >
                                                {log.operator && log.operator.username}
                                            </span>
                                            {log.remark}
                                        </Space>
                                    </span>
                                </div>
                                <div className={styles['create-date']}>
                                    <Tooltip placement="top" title={log.create_time}>
                                        <div>{log.created_at_humanize}</div>
                                    </Tooltip>
                                </div>
                            </div>
                            <LogComment log={log} />
                        </div>
                    </For>
                </div>
            </div>
            <div className={styles['wrap-comment']}>
                <div className={styles['input']}>
                    {/* 选择人员 */}
                    <Popover
                        open={showUserListPopover}
                        overlayClassName={styles['mention-user-list']}
                        content={
                            <div className={styles['user-list']}>
                                <For each="user" of={currentTask?.participators || []}>
                                    <div
                                        key={user.id}
                                        className={styles['user-item']}
                                        onClick={() => mentionUserSelect(user)}
                                    >
                                        <Avatar
                                            src={user.avatar || ''}
                                            className={styles['user-avatar']}
                                        />
                                        <div className={styles['username']}>{user.username}</div>
                                    </div>
                                </For>
                            </div>
                        }
                    ></Popover>
                    <Input.TextArea
                        value={content}
                        placeholder="@ 提及他人，按Enter快速发布"
                        autosize={{ minRows: 2, maxRows: 6 }}
                        onChange={handleContentChange}
                        onPressEnter={doCreate}
                        bordered={false}
                        ref={inputRef}
                    />
                    <div className={styles['ctrl']}>
                        <IconFont className={styles['btn-emoji']} type="emoji" />
                        <Button type="link" size="medium" onClick={doCreate}>
                            发布
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskLog;
