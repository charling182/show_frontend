import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin, message, Modal } from 'antd';
import { getUserList } from '@/api';
import {
    ExclamationCircleFilled,
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    StopOutlined,
    CheckCircleOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons';
import BtnTooltip from '@/components/btn-tooltip';
import { putChangeUserData, updateUserDepartment, deleteDepartment } from '@/api';
import DepartmentOperation from '../department-operation';
import UserInfoDialog from '@/components/user-info-dialog';
import AddMemberToDepartmentDialog from '../add-member-to-department-dialog';

import styles from './index.less';

const { confirm } = Modal;

interface departmentInfo {
    id: number;
    name: string;
}

const MyComponent = (props) => {
    const {
        isDepartment,
        departmentData,
        memberData,
        userListParams,
        handleDepartmentSuccess,
        handleDeleteDepartmentSuccess,
    } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [userData, setUserData] = useState<types.user.userListParams[]>([]);
    const [departmentOperationBtns, setDepartmentOperationBtns] = useState<
        types.user.departmentOperationBtns[]
    >([
        {
            label: '添加成员',
            icon: <UserAddOutlined />,
            disabled: false,
        },
        {
            label: '编辑部门',
            icon: <EditOutlined />,
            disabled: false,
        },
        {
            label: '删除部门',
            icon: <DeleteOutlined />,
            disabled: false,
        },
    ]);
    const [userInfoVisible, setUserInfoVisible] = useState<boolean>(false);
    const [selectUser, setSelectUser] = useState<(types.user.userListParams & { id: number }) | {}>(
        {}
    ); // 选中的用户信息
    const [
        addMemberToDepartmentDialogVisible,
        setAddMemberToDepartmentDialogVisible,
    ] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const departmentOperationBtnClick = (index: number) => {
        switch (index) {
            case 0:
                setAddMemberToDepartmentDialogVisible(true);
                break;
            case 1:
                setVisible(true);
                break;
            case 2:
                confirm({
                    title: '此操作将永久删除该部门，并释放所有成员, 是否继续?',
                    icon: <ExclamationCircleFilled />,
                    onOk: async () => {
                        const result = await deleteDepartment({ ids: [departmentData.id] });
                        if (result.code === 200) {
                            message.success('删除成功');
                            handleDeleteDepartmentSuccess();
                        }
                    },
                    onCancel() {
                        message.info('已取消删除');
                    },
                });
                break;
            default:
                break;
        }
    };

    const usernameClick = (item: types.user.userListParams & { id: number }) => {
        setSelectUser(item);
        setUserInfoVisible(true);
    };

    const forbiddenUser = async (
        item: types.user.userListParams & {
            department: departmentInfo;
            id: number;
        }
    ) => {
        const result = await putChangeUserData({ id: item.id, state: 0 });
        if (result.code === 200) {
            message.success('禁用成功');
            handelGetUserList();
        }
    };

    const enableUser = async (
        item: types.user.userListParams & {
            department: departmentInfo;
            id: number;
        }
    ) => {
        const result = await putChangeUserData({ id: item.id, state: 1 });
        if (result.code === 200) {
            message.success('启用成功成功');
            handelGetUserList();
        }
    };

    const removeUserFromDepartment = async (
        item: types.user.userListParams & {
            department: departmentInfo;
            id: number;
        }
    ) => {
        const result = await updateUserDepartment({
            id: item.id,
            department_id: 0,
        });
        if (result.code === 200) {
            message.success('移除成功');
            handelGetUserList();
        }
    };
    // 获取用户列表数据
    const handelGetUserList = async () => {
        setLoading(true);
        const result = await getUserList(userListParams);
        if (result.code === 200) {
            setUserData(result.data.rows);
        }
        setLoading(false);
    };

    const handleAddMemberToDepartmentSuccess = () => {
        handelGetUserList();
    };

    useEffect(() => {
        handelGetUserList();
    }, [userListParams]);

    return (
        <div className={styles['user-content']}>
            <div className={styles['wrap-content-head']}>
                <div className={styles['title-content']}>
                    {isDepartment ? departmentData?.name : memberData.title}.
                    {userData && userData.length}
                </div>
                {isDepartment && (
                    <div className={styles['wrap-ctrl']}>
                        {departmentOperationBtns.map((item, index) => (
                            <Button
                                key={index}
                                type="link"
                                disabled={item.disabled}
                                onClick={() => departmentOperationBtnClick(index)}
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles['wrap-list']}>
                <Spin spinning={loading}>
                    {userData.map((item, index) => (
                        <div key={index} className={styles['wrap-list-item']}>
                            <img className={styles['user-avatar']} src={item.avatar} alt="" />
                            <div className={styles['user-info']}>
                                <div
                                    className={styles['user-name']}
                                    onClick={() => usernameClick(item)}
                                >
                                    {item.username}
                                </div>
                                <div className={`${styles['foot']} ${styles['color-light']}`}>
                                    <div className={styles['user-emial']}>{item.email}</div>
                                    <div>{item.department && item.department.name}</div>
                                </div>
                            </div>
                            {isDepartment && (
                                <div className={`${styles['wrap-ctrl']} ${styles['color-light']}`}>
                                    {item.state === 1 ? (
                                        <Popconfirm
                                            title="确定禁用此用户吗？"
                                            onConfirm={() => forbiddenUser(item)}
                                        >
                                            <BtnTooltip
                                                icon={<StopOutlined />}
                                                tooltipContent="禁用"
                                            ></BtnTooltip>
                                        </Popconfirm>
                                    ) : (
                                        <Popconfirm
                                            title="确定启用此用户吗？"
                                            onConfirm={() => enableUser(item)}
                                        >
                                            <BtnTooltip
                                                icon={<CheckCircleOutlined />}
                                                tooltipContent="启用"
                                            />
                                        </Popconfirm>
                                    )}
                                    <span className={styles['line']}></span>
                                    <Popconfirm
                                        title="确定移除此用户吗？"
                                        onConfirm={() => removeUserFromDepartment(item)}
                                    >
                                        <BtnTooltip
                                            icon={<UserDeleteOutlined />}
                                            tooltipContent="移除"
                                        />
                                    </Popconfirm>
                                </div>
                            )}
                        </div>
                    ))}
                </Spin>
            </div>
            <DepartmentOperation
                departmentData={departmentData}
                visible={visible}
                setVisible={setVisible}
                onDepartmentSuccess={handleDepartmentSuccess}
            />
            <UserInfoDialog
                visible={userInfoVisible}
                setVisible={setUserInfoVisible}
                userId={selectUser.id}
            />
            <AddMemberToDepartmentDialog
                departmentData={departmentData}
                visible={addMemberToDepartmentDialogVisible}
                setVisible={setAddMemberToDepartmentDialogVisible}
                onAddMemberToDepartmentSuccess={handleAddMemberToDepartmentSuccess}
            />
        </div>
    );
};

export default MyComponent;
