import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Input,
    Table,
    Pagination,
    Form,
    Space,
    Popconfirm,
    message,
    Row,
    Col,
    Modal,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    CheckOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
} from '@ant-design/icons';
import { getRoleList, setDefaultRole, deleteRole } from '@/api';

import styles from './index.less';
import RoleManagementEdit from './components/role-management-edit';
import RoleMenuManagementEdit from './components/role-menu-management-edit';
import RolePermissionManagementEdit from './components/role-permission-management-edit';

const { confirm } = Modal;

const RoleManagement = () => {
    const [list, setList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchVal, setSearchVal] = useState<string>('');
    const [queryForm, setQueryForm] = useState({
        prop_order: '', // 排序字段
        order: '', // 排序方式
        pageNo: 1,
        pageSize: 10,
        keyword: '',
    });
    const [roleManagementEditVisible, setRoleManagementEditVisible] = useState<boolean>(false);
    const [roleMenuManagementEditVisible, setRoleMenuManagementEditVisible] = useState<boolean>(
        false
    );
    const [
        rolePermissionManagementEditVisible,
        setRolePermissionManagementEditVisible,
    ] = useState<boolean>(false);

    // 自增值,触发重新请求
    const [refresh, setRefresh] = useState<number>(0);
    // 被选中要编辑的行
    const [editRow, setEditRow] = useState<any>({});

    const fetchData = async () => {
        setListLoading(true);
        const { pageSize, pageNo } = queryForm;
        const {
            data: { rows, count },
        } = await getRoleList({
            ...queryForm,
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
        });
        setList(rows);
        setTotal(count);
        setListLoading(false);
    };

    const onEditSuccess = () => {
        setEditRow({});
        setRefresh(refresh + 1);
        setRoleManagementEditVisible(false);
    };
    const onMenuEditSuccess = () => {
        setRefresh(refresh + 1);
        setRoleMenuManagementEditVisible(false);
    };
    const onPermissionEditSuccess = () => {
        setRefresh(refresh + 1);
        setRolePermissionManagementEditVisible(false);
    };

    useEffect(() => {
        fetchData();
    }, [queryForm, refresh]);

    const handleEdit = (row) => {
        if (row && row.id) {
            setEditRow(row);
        }
        setRoleManagementEditVisible(true);
    };

    const handleDelete = (row?: any) => {
        if (row && row.id) {
            confirm({
                title: `你确定要删除当前项吗?`,
                icon: <ExclamationCircleFilled />,
                onOk: async () => {
                    const { data, code } = await deleteRole({ ids: [row.id] });
                    if (code === 200) {
                        setRefresh(refresh + 1);
                        message.success('删除成功');
                    }
                },
                onCancel() {
                    message.info('已取消');
                },
            });
        } else {
            confirm({
                title: `你确定要删除当前选中项吗?`,
                icon: <ExclamationCircleFilled />,
                onOk: async () => {
                    const ids = selectedRows.map((item) => item.id);
                    const { data, code } = await deleteRole({ ids });
                    if (code === 200) {
                        setRefresh(refresh + 1);
                        message.success('删除成功');
                    }
                },
                onCancel() {
                    message.info('已取消');
                },
            });
        }
    };

    const handleSetDefault = (row) => {
        confirm({
            title: `你确定要设置 “${row.name}” 为默认角色吗`,
            icon: <ExclamationCircleFilled />,
            onOk: async () => {
                const { data, code } = await setDefaultRole({ id: row.id });
                if (code === 200) {
                    setRefresh(refresh + 1);
                    message.success('设置成功');
                }
            },
            onCancel() {
                message.info('已取消');
            },
        });
    };
    const handleMenuEdit = (row) => {
        if (row.id) {
            setEditRow(row);
        }
        setRoleMenuManagementEditVisible(true);
    };

    const handlePermissionEdit = (row) => {
        if (row.id) {
            setEditRow(row);
        }
        setRolePermissionManagementEditVisible(true);
    };

    const handleSizeChange = (val) => {
        setQueryForm({ ...queryForm, pageSize: val });
        fetchData();
    };

    const handleCurrentChange = (val) => {
        setQueryForm({ ...queryForm, pageNo: val });
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
            width: '25%',
        },
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            width: '25%',
        },
        {
            title: '是否为默认角色',
            dataIndex: 'is_default',
            key: 'is_default',
            width: '25%',
            render: (is_default: number) => (
                <CheckOutlined
                    style={{
                        color: is_default === 1 ? '#67C23A' : '#F56C6C',
                        fontSize: '16px',
                    }}
                />
            ),
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        type="link"
                        // disabled={!rolePermissionPermissions.getList}
                        onClick={() => handlePermissionEdit(record)}
                    >
                        资源管理
                    </Button>
                    <Button
                        type="link"
                        // disabled={!roleMenuPermissions.getList}
                        onClick={() => handleMenuEdit(record)}
                    >
                        菜单管理
                    </Button>
                    <Button
                        type="link"
                        // disabled={!rolePermissions.doEdit}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        danger
                        // disabled={!rolePermissions.doEdit}
                        onClick={() => handleDelete(record)}
                    >
                        删除
                    </Button>
                    <Button
                        type="link"
                        disabled={record.is_default === 1}
                        onClick={() => handleSetDefault(record)}
                    >
                        设为默认
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles['role-management']}>
            <div className={styles.header}>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        // disabled={!rolePermissions.doCreate}
                        onClick={() => handleEdit()}
                    >
                        添加
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRows.length === 0}
                        // disabled={!rolePermissions.doCreate}
                        onClick={() => handleDelete()}
                    >
                        批量删除
                    </Button>
                </Space>
                <Input.Search
                    style={{ width: '240px' }}
                    placeholder="请输入角色名"
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
                    onChange: (_, selectedRows) => setSelectedRows(selectedRows),
                }}
                loading={listLoading}
                columns={columns}
                dataSource={list}
                pagination={false}
                rowKey="id"
                onChange={(pagination, filters, sorter) => {
                    const order = sorter.order ? sorter.order.replace('end', '') : '';
                    setQueryForm({ ...queryForm, prop_order: sorter.columnKey, order });
                }}
            />

            <Pagination
                className={styles['pagination']}
                current={queryForm.pageNo}
                pageSize={queryForm.pageSize}
                total={total}
                showSizeChanger
                onShowSizeChange={handleSizeChange}
                onChange={handleCurrentChange}
            />

            <RoleManagementEdit
                editRow={editRow}
                roleManagementEditVisible={roleManagementEditVisible}
                setRoleManagementEditVisible={setRoleManagementEditVisible}
                onEditSuccess={onEditSuccess}
            />
            <RoleMenuManagementEdit
                editRow={editRow}
                roleMenuManagementEditVisible={roleMenuManagementEditVisible}
                setRoleMenuManagementEditVisible={setRoleMenuManagementEditVisible}
                onMenuEditSuccess={onMenuEditSuccess}
            />
            <RolePermissionManagementEdit
                editRow={editRow}
                rolePermissionManagementEditVisible={rolePermissionManagementEditVisible}
                setRolePermissionManagementEditVisible={setRolePermissionManagementEditVisible}
                onPermissionEditSuccess={onPermissionEditSuccess}
            />
        </div>
    );
};

RoleManagement.menu = {
    name: '角色管理',
    icon: 'LineChartOutlined',
};

RoleManagement.order = 2;

export default RoleManagement;
