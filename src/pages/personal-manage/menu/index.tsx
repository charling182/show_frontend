import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Pagination, Modal, message } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getMenuList, deleteMenu, addMenu, updateMenu } from '@/api';
import MenuManagementEdit from './components/edit';

import styles from './index.less';

const { confirm } = Modal;

const MenuManagement = () => {
    const [list, setList] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [queryForm, setQueryForm] = useState({
        prop_order: '',
        order: '',
        pageNo: 1,
        pageSize: 5,
        keyword: '',
    });
    // 自增值,触发重新请求
    const [refresh, setRefresh] = useState<number>(0);
    // 被选中要编辑的行
    const [editRow, setEditRow] = useState<any>({});
    const [menuManagementVisible, setMenuManagementVisible] = useState<boolean>(false);
    const [createNew, setCreateNew] = useState<boolean>(false);
    // ...省略了useState, useEffect和处理函数
    const handlePageChange = (page, pageSize) => {
        setQueryForm({
            ...queryForm,
            pageNo: page,
            pageSize,
        });
    };

    const handlePageSizeChange = (current, size) => {
        setQueryForm({
            ...queryForm,
            pageNo: 1,
            pageSize: size,
        });
    };

    const handleNewMenu = (row, isNew) => {
        setEditRow(row);
        setCreateNew(isNew);
        setMenuManagementVisible(true);
    };

    const onMenuManagementEditSuccess = () => {
        setEditRow({});
        setRefresh(refresh + 1);
        setMenuManagementVisible(false);
    };
    const fetchData = async () => {
        setListLoading(true);
        const { pageSize, pageNo } = queryForm;
        const {
            data: { rows, count },
        } = await getMenuList({
            ...queryForm,
            limit: pageSize,
            offset: (pageNo - 1) * pageSize,
        });
        setList(rows);
        setTotal(count);
        setListLoading(false);
    };

    const handleEdit = (row) => {
        if (row && row.id) {
            setEditRow(row);
        }
        // setUserManagementVisible(true);
    };

    const handleDelete = (row) => {
        if (row.id) {
            confirm({
                title: '你确定要删除当前项吗?',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    await deleteMenu({ ids: [row.id] });
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
                        await deleteMenu({ ids });
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

    useEffect(() => {
        fetchData();
    }, [queryForm, refresh]);

    const columns = [
        {
            title: '路由title',
            dataIndex: 'title',
            key: 'title',
            width: '160px',
            fixed: 'left',
        },
        {
            title: '路由名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '父ID',
            dataIndex: 'parent_id',
            key: 'parent_id',
        },
        {
            title: '图标url',
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: '路由路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '是否隐藏',
            dataIndex: 'hidden',
            key: 'hidden',
            render: (hidden) => (
                <CheckOutlined
                    style={{
                        color: hidden === 1 ? '#67C23A' : '#F56C6C',
                        fontSize: '24px',
                    }}
                />
            ),
        },
        {
            title: '总是显示',
            dataIndex: 'always_show',
            key: 'always_show',
            render: (always_show) => (
                <CheckOutlined
                    style={{
                        color: always_show === 1 ? '#67C23A' : '#F56C6C',
                        fontSize: '24px',
                    }}
                />
            ),
        },
        {
            title: '缓存',
            dataIndex: 'keep_alive',
            key: 'keep_alive',
            render: (keep_alive) => (
                <CheckOutlined
                    style={{
                        color: keep_alive === 1 ? '#67C23A' : '#F56C6C',
                        fontSize: '24px',
                    }}
                />
            ),
        },
        {
            title: 'target',
            dataIndex: 'target',
            key: 'target',
            width: '80px',
        },
        {
            title: '对应组件',
            dataIndex: 'component',
            key: 'component',
        },
        {
            title: '路由重定向',
            dataIndex: 'redirect',
            key: 'redirect',
            width: '130px',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: '200',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        // disabled={!menuPermissions.doCreate}
                        type="link"
                        onClick={() => handleEdit(record, true)}
                    >
                        添加下级菜单
                    </Button>
                    <Button
                        // disabled={!menuPermissions.doEdit}
                        type="link"
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        // disabled={!menuPermissions.doDelete}
                        type="link"
                        onClick={() => handleDelete(record)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles['menu-management']}>
            <div className={styles['header']}>
                <Space>
                    <Button
                        // disabled={!menuPermissions.doCreate}
                        type="primary"
                        onClick={() => handleEdit({}, true)}
                    >
                        新建菜单
                    </Button>
                    <Button danger onClick={() => handleDelete({})}>
                        批量删除
                    </Button>
                </Space>
            </div>
            <Table
                columns={columns}
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
                loading={listLoading}
                dataSource={list}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
            <Pagination
                className={styles['pagination']}
                current={queryForm.pageNo}
                pageSize={queryForm.pageSize}
                total={total}
                onChange={handlePageChange}
                onShowSizeChange={handlePageSizeChange}
            />
            {/* <MenuManagementEdit
        editRow={editRow}
        menuManagementVisible={menuManagementVisible}
        setMenuManagementVisible={setMenuManagementVisible}
        onMenuManagementEditSuccess={onMenuManagementEditSuccess}
      /> */}
        </div>
    );
};

// MenuManagement.menu = {
//     name: '菜单管理',
//     icon: 'MenuOutlined',
// };

// MenuManagement.order = 3;
export default MenuManagement;
