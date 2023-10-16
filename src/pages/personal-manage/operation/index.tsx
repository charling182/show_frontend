import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Pagination, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { getOperationList, deleteOperation } from '@/api';
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
        } = await getOperationList({
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
                    await deleteOperation({ ids: [row.id] });
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
                        await deleteOperation({ ids });
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
    const getStatusTagType = (status: string) => {
        let type = '';
        switch (true) {
            case /^2.*/.test(status):
                type = 'success';
                break;
            case /^4.*/.test(status):
                type = 'warning';
                break;
            case /^5.*/.test(status):
                type = 'danger';
                break;
            default:
                type = 'warning';
        }
        return type;
    };
    const getMethodTagType = (method: string) => {
        let type = '';
        switch (method) {
            case 'POST':
                type = 'success';
                break;
            case 'PUT':
                type = '';
                break;
            case 'DELETE':
                type = 'info';
                break;
            default:
                type = 'info';
        }
        return type;
    };
    const columns = [
        {
            title: '操作人',
            dataIndex: 'operator_username',
            key: 'operator_username',
            fixed: 'left',
            width: 120,
        },
        {
            title: '日期',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 200,
        },
        {
            title: '状态码',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => <Tag color={getStatusTagType(status)}>{status}</Tag>,
        },
        {
            title: '请求IP',
            dataIndex: 'ip',
            key: 'ip',
            width: 120,
        },
        {
            title: '请求方法',
            dataIndex: 'method',
            key: 'method',
            width: 100,
            render: (method: string) => <Tag color={getMethodTagType(method)}>{method}</Tag>,
        },
        {
            title: '请求路径',
            dataIndex: 'url',
            key: 'url',
            width: 200,
        },
        {
            title: '请求体',
            dataIndex: 'params',
            key: 'params',
            width: 200,
            ellipsis: true,
        },
    ];

    return (
        <div className={styles['user-management']}>
            <div className={styles.header}>
                <div></div>
                <Input.Search
                    style={{ width: '240px' }}
                    placeholder="操作人/状态码/请求IP/请求方法/请求路径"
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
        </div>
    );
};

UserManagement.menu = {
    name: '操作日志',
    icon: 'LineChartOutlined',
};

UserManagement.order = 4;

export default UserManagement;
