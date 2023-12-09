import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Table, Pagination, Space, message, Modal } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    CloseOutlined,
    CheckOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
} from '@ant-design/icons';
import { getPermissionList, deletePermission } from '@/api';

import styles from './index.less';
import PermissionManagementEdit from './components/permission-management-edit';

const { confirm } = Modal;

const PermissionMangement = () => {
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
    const [permissionManagementEditVisible, setPermissionManagementEditVisible] = useState<boolean>(
        false
    );

    // 自增值,触发重新请求
    const [refresh, setRefresh] = useState<number>(0);
    // 被选中要编辑的行
    const [editRow, setEditRow] = useState<any>({});

    const fetchData = async () => {
        setListLoading(true);
        const { pageSize, pageNo } = queryForm;
        const {
            data: { rows, count },
        } = await getPermissionList({
            ...queryForm,
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
        });
        setList(rows);
        setTotal(count);
        setListLoading(false);
    };
    const onPermissionEditSuccess = () => {
        setRefresh(refresh + 1);
        setPermissionManagementEditVisible(false);
    };

    useEffect(() => {
        fetchData();
    }, [queryForm, refresh]);

    const handleEdit = (row: any) => {
        if (row && row.id) {
            setEditRow(row);
        }
        setPermissionManagementEditVisible(true);
    };

    const handleDelete = (row?: any) => {
        if (row && row.id) {
            confirm({
                title: `你确定要删除当前项吗?`,
                icon: <ExclamationCircleFilled />,
                onOk: async () => {
                    const { data, code } = await deletePermission({ ids: [row.id] });
                    setRefresh(refresh + 1);
                    message.success('删除成功');
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
                    const { data, code } = await deletePermission({ ids });
                    setRefresh(refresh + 1);
                    message.success('删除成功');
                },
                onCancel() {
                    message.info('已取消');
                },
            });
        }
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
            title: '标识码',
            dataIndex: 'mark',
            key: 'mark',
        },
        {
            title: '标识码名',
            dataIndex: 'mark_name',
            key: 'mark_name',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '路径',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: '动作',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: 100,
            render: (state: number) => {
                return state === 1 ? (
                    <CheckOutlined
                        style={{
                            color: '#67C23A',
                            fontSize: '16px',
                        }}
                    />
                ) : (
                    <CloseOutlined
                        style={{
                            color: '#F56C6C',
                            fontSize: '16px',
                        }}
                    />
                );
            },
        },
        {
            title: '需要认证',
            dataIndex: 'authentication',
            key: 'authentication',
            render: (authentication: number) => {
                return authentication === 1 ? (
                    <CheckOutlined
                        style={{
                            color: '#67C23A',
                            fontSize: '16px',
                        }}
                    />
                ) : (
                    <CloseOutlined
                        style={{
                            color: '#F56C6C',
                            fontSize: '16px',
                        }}
                    />
                );
            },
        },
        {
            title: '需要授权',
            dataIndex: 'authorization',
            key: 'authorization',
            render: (authorization: number) => {
                return authorization === 1 ? (
                    <CheckOutlined
                        style={{
                            color: '#67C23A',
                            fontSize: '16px',
                        }}
                    />
                ) : (
                    <CloseOutlined
                        style={{
                            color: '#F56C6C',
                            fontSize: '16px',
                        }}
                    />
                );
            },
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'actions',
            render: (text, record) => (
                <Space>
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
                    placeholder="请输入资源名称"
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
            <PermissionManagementEdit
                editRow={editRow}
                permissionManagementEditVisible={permissionManagementEditVisible}
                setPermissionManagementEditVisible={setPermissionManagementEditVisible}
                onEditSuccess={onPermissionEditSuccess}
            />
        </div>
    );
};

PermissionMangement.menu = {
    name: '资源管理',
    icon: 'LineChartOutlined',
};

PermissionMangement.order = 4;

export default PermissionMangement;
