import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Pagination, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { getList, doDelete, permissions as userPermissions } from '@/api/user';
// import { permissions as userRolePermissions } from '@/api/userRoleManagement';
import UserManagementEdit from './components/user-management-edit';
import UserRoleManagementEdit from './components/user-role-management-edit';

import { getUserList, deleteUser } from '@/api';
import styles from './index.less';

const { confirm } = Modal;

const UserManagement = () => {
    const [list, setList] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [queryForm, setQueryForm] = useState({
        prop_order: '',
        order: '',
        pageNo: 1,
        pageSize: 10,
        keyword: '',
    });
    const [searchVal, setSearchVal] = useState<string>('');
    // 自增值,触发重新请求
    const [refresh, setRefresh] = useState<number>(0);
    // 被选中要编辑的行
    const [editRow, setEditRow] = useState<any>({});
    const [userManagementVisible, setUserManagementVisible] = useState<boolean>(false);
    const [userRoleManagementVisible, setUserRoleManagementVisible] = useState<boolean>(false);
    useEffect(() => {
        fetchData();
    }, [queryForm, refresh]);

    const fetchData = async () => {
        setListLoading(true);
        const { pageSize, pageNo } = queryForm;
        const {
            data: { rows, count },
        } = await getUserList({
            ...queryForm,
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
        });
        setList(rows);
        setTotal(count);
        setListLoading(false);
    };

    const handleRoleEdit = (row) => {
        setEditRow(row);
        setUserRoleManagementVisible(true);
    };

    const handleEdit = (row) => {
        if (row && row.id) {
            setEditRow(row);
            setUserManagementVisible(true);
        }
    };
    const onUserManagementEditSuccess = () => {
        setEditRow({});
        setRefresh(refresh + 1);
        setUserManagementVisible(false);
    };
    const onUserRoleManagementEditSuccess = () => {
        setEditRow({});
        setRefresh(refresh + 1);
        setUserRoleManagementVisible(false);
    };

    const handleDelete = (row) => {
        if (row.id) {
            confirm({
                title: '你确定要删除当前项吗?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    await deleteUser({ ids: [row.id] });
                    message.success('删除成功');
                    setRefresh(refresh + 1);
                },
            });
        } else {
            if (selectedRows.length > 0) {
                const ids = selectedRows.map((item) => item.id);
                confirm({
                    title: '你确定要删除选中项吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk: async () => {
                        await deleteUser({ ids });
                        message.success('删除成功');
                        setRefresh(refresh + 1);
                    },
                });
            } else {
                message.error('未选中任何行');
                return false;
            }
        }
    };

    const handleSizeChange = (pageSize) => {
        setQueryForm({ ...queryForm, pageSize });
        fetchData();
    };

    const handleCurrentChange = (pageNo) => {
        setQueryForm({ ...queryForm, pageNo });
        fetchData();
    };

    const handleSearch = (value: string) => {
        setSearchVal(value);
        setQueryForm({ ...queryForm, keyword: value, pageNo: 1 });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            fixed: 'left',
            width: 80,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
            width: 100,
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            ellipsis: true,
            width: 100,
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            width: 200,
            render: (roles) => (
                <>
                    {roles.map((role) => (
                        <Tag color="processing" key={role.id}>
                            {role.name}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 100,
            render: (avatar) => (
                <img src={avatar || ''} width={40} height={40} style={{ borderRadius: 6 }} />
            ),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: '手机',
            dataIndex: 'phone',
            key: 'phone',
            width: 200,
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: 100,
            render: (state) => (
                <span style={{ color: state === 1 ? '#67c23a' : '#F56C6C' }}>
                    {state === 1 ? '正常' : '停用'}
                </span>
            ),
        },
        {
            title: '最近登录时间',
            dataIndex: 'last_login',
            key: 'last_login',
            width: 200,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 300,
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleRoleEdit(record)}>
                        角色管理
                    </Button>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className={styles['user-management']}>
            <div className={styles.header}>
                <Button danger onClick={() => handleDelete({})}>
                    批量删除
                </Button>
                <Input.Search
                    style={{ width: '240px' }}
                    placeholder="用户名/邮箱/手机"
                    allowClear
                    value={searchVal}
                    onSearch={handleSearch}
                    onChange={(e) => {
                        setSearchVal(e.target.value.trim());
                        !e.target.value.trim()
                            ? setQueryForm({
                                  ...queryForm,
                                  keyword: e.target.value.trim(),
                                  pageNo: 1,
                              })
                            : null;
                    }}
                />
            </div>
            <Table
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
                scroll={{ x: 1300 }}
                columns={columns}
                dataSource={list}
                loading={listLoading}
                pagination={false}
                rowKey="id"
                onChange={(pagination, filters, sorter) => {
                    const order = sorter.order ? sorter.order.replace('end', '') : '';
                    setQueryForm({ ...queryForm, prop_order: sorter.columnKey, order });
                }}
            />
            <Pagination
                className={styles['pagination']}
                showSizeChanger
                current={queryForm.pageNo}
                pageSize={queryForm.pageSize}
                total={total}
                onChange={handleCurrentChange}
                onShowSizeChange={handleSizeChange}
                style={{ marginTop: '16px' }}
            />
            <UserManagementEdit
                editRow={editRow}
                userManagementVisible={userManagementVisible}
                setUserManagementVisible={setUserManagementVisible}
                onUserManagementEditSuccess={onUserManagementEditSuccess}
            />
            <UserRoleManagementEdit
                editRow={editRow}
                userRoleManagementVisible={userRoleManagementVisible}
                setUserRoleManagementVisible={setUserRoleManagementVisible}
                onUserRoleManagementEditSuccess={onUserRoleManagementEditSuccess}
            />
        </div>
    );
};

UserManagement.menu = {
    name: '用户管理',
    icon: 'LineChartOutlined',
};

UserManagement.order = 1;

export default UserManagement;
