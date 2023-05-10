import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Pagination, Spin, message } from 'antd';
import { SearchOutlined, UserAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel } from 'umi';
import BImage from '@/components/b-image';
import { getUserList as getList, createInvite } from '@/api';

const AddMemberToProjectDialog = ({ project, addMemberVisible = false, handleAddMemberFinish }) => {
    const { initialState } = useModel('@@initialState');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [userData, setUserData] = useState([]);
    const [userList, setUserList] = useState([]);
    const pageSize = 6;

    const isManager = initialState?.id === project.manager_id;
    const dialogTitle = isManager ? '邀请新成员' : '项目成员';

    useEffect(() => {
        if (addMemberVisible) {
            getUserList();
        }
    }, [addMemberVisible, keyword]);

    useEffect(() => {
        // onUserListChange(userList);
    }, [userList]);

    const show = (project) => {
        setDialogVisible(true);
    };

    const handleCurrentChange = (val) => {
        setPageNo(val);
    };

    const getUserList = async () => {
        setLoading(true);
        setUserList([]);
        setUserData([]);
        const params = {
            keyword: keyword,
        };
        if (!isManager) {
            params.project_id = project.id;
        }
        const { data } = await getList(params);
        setUserData(data);
        setUserList(
            data.rows.map((item) => {
                return {
                    ...item,
                    projectIds: item.projects && item.projects.map((project) => project.id),
                    invited: false,
                };
            })
        );
        setLoading(false);
    };

    const handleCreateInvite = async (body) => {
        const { code } = await createInvite(body);
        if (code === 200) {
            message.success('邀请成功');
        }
        // Do something after successful invite
    };

    const add = async (user) => {
        await handleCreateInvite({
            group: 'Projects',
            group_id: project.id,
            receiver_id: user.id,
        });
        // Set this user as invited
        // user.invited = true;
    };

    const quit = async (user) => {
        // await doQuit({
        //     user_id: user.id,
        //     project_id: project.id,
        // });
        // getUserList();
        // Notify success
    };

    return (
        <Modal
            title={dialogTitle}
            open={addMemberVisible}
            className={styles['add-member-to-project-dialog']}
            width="530px"
            footer={null}
            onCancel={() => handleAddMemberFinish('quit')}
        >
            <div className={styles['wrap-content']}>
                {isManager && (
                    <div className={styles['wrap-intro']}>
                        <span>账号邀请</span>
                        <Button type="text" disabled size="medium">
                            通过链接邀请
                        </Button>
                    </div>
                )}
                <Input
                    value={keyword}
                    placeholder="请输入用户名或邮箱查找"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <div className={styles['user-list']}>
                    {loading ? (
                        <Spin />
                    ) : (
                        userList.map((item, index) => (
                            <div key={index} className={styles['wrap-list-item']}>
                                <BImage
                                    className={styles['user-avatar']}
                                    src={item.avatar || ''}
                                    width="32"
                                    height="32"
                                    borderRadius="32"
                                />
                                <div className={styles['user-info']}>
                                    <div className={styles['user-name']}>{item.username}</div>
                                    <div className={styles['foot']}>
                                        <div className={styles['user-email']}>{item.email}</div>
                                    </div>
                                </div>
                                <div className={styles['wrap-ctrl']}>
                                    {!item.projectIds.includes(project.id) ? (
                                        <Button
                                            size="small"
                                            disabled={item.invited}
                                            type="primary"
                                            icon={<UserAddOutlined />}
                                            onClick={() => add(item)}
                                        >
                                            {item.invited ? '已邀请' : '邀请'}
                                        </Button>
                                    ) : (
                                        <div>
                                            {item.id !== project.manager_id &&
                                            project.manager_id === initialState?.id ? (
                                                <Button
                                                    size="small"
                                                    type="danger"
                                                    icon={<CloseCircleOutlined />}
                                                    onClick={() => quit(item)}
                                                >
                                                    移出
                                                </Button>
                                            ) : (
                                                <div>
                                                    <span
                                                        className={styles['iconfont']}
                                                        style={{ marginRight: 5 }}
                                                    >
                                                        {item.id === project.manager_id
                                                            ? '拥有者'
                                                            : '已加入'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AddMemberToProjectDialog;
