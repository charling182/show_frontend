import React, { useState, useEffect, useRef } from 'react';
import { Modal, Tree, Button, Form, message, Space } from 'antd';
import { getRoleMenu, getMenuList, addRoleBulkMenu, deleteRoleBulkMenu } from '@/api'; // 请根据您的项目路径进行调整
import { uniq, difference } from 'lodash';

const RoleMenuManagementEdit = ({
    roleMenuManagementEditVisible,
    setRoleMenuManagementEditVisible,
    onMenuEditSuccess = () => {},
    editRow,
}) => {
    const [loading, setLoading] = useState(false);
    const [menuListData, setMenuListData] = useState<any[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [roleMenuListData, setRoleMenuListData] = useState<any[]>([]);
    const [menuListOrigin, setMenuListOrigin] = useState<any[]>([]);
    const [menuIdsOrigin, setMenuIdsOrigin] = useState<number[]>([]);

    // ... 其他状态和副作用

    const formRef = useRef(null);
    const menuRef = useRef(null);
    const menuListRef = useRef(null);

    /**
     * 数组转树形结构
     * @param list 源数组
     * @param tree 树
     * @param parentId 父ID
     */
    const listToTree = (list, tree, parentId, allMenuIds) => {
        list.forEach((item) => {
            // 判断是否为父级菜单
            if (item.parent_id === parentId) {
                const child = {
                    ...item,
                    key: item.id,
                    children: [],
                };
                // 迭代 list， 找到当前菜单相符合的所有子菜单
                listToTree(list, child.children, item.id, allMenuIds);
                // 删掉不存在 children 值的属性
                if (child.children.length <= 0) {
                    delete child.children;
                }

                allMenuIds.push(item.id);
                // 加入到树中
                tree.push(child);
            }
            return allMenuIds;
        });
    };
    const doGetRoleList = async () => {
        const {
            data: { rows, count },
        } = await getMenuList({ limit: 1000, offset: 0 });
        setMenuListOrigin(rows);
        const data = rows.map((e) => {
            e.label = e.title;
            return e;
        });
        let childrenNav: any[] = [];
        let allMenuIds: number[] = [];
        // 后端数据, 根级树数组,  根级 PID
        listToTree(data, childrenNav, 0, allMenuIds);
        menuRef.current = allMenuIds;
        menuListRef.current = rows;
        console.log('childrenNav------------', childrenNav);

        setMenuListData(childrenNav);
        doGetRoleMenuList(editRow);
    };

    /**
     * 获取当前角色的所有菜单
     * @param row
     * @returns {Promise<void>}
     */
    const doGetRoleMenuList = async (row) => {
        const {
            data: { rows = [], count },
        } = await getRoleMenu({ role_id: row.id, limit: 1000, offset: 0 });
        // setCheckedKeys(rows.map((e) => e.menu_id));
        setRoleMenuListData(rows);
        // 获取所有菜单的父节点
        let parentIds: number[] = [];
        menuListRef.current.map((e) => {
            parentIds.push(e.parent_id);
        });
        parentIds = difference(uniq(parentIds), [0]);
        // // // 获取所有菜单的子节点
        let childrenIds: number[] = [];
        menuListRef.current.map((e) => {
            childrenIds.push(e.id);
        });
        // // 原当前角色菜单所有节点id
        setMenuIdsOrigin(
            rows.map((e) => {
                return e.menu_id;
            })
        );
        // 原当前角色菜单所有子节点id,一旦父节点被选中,子节点也会被选中,可实际上我们可能只是拥有父节点以及父节点下的某些子节点
        // 所以我们需要将父节点的id从节点中剔除,再真正调用接口时,再传子节点以及父节点
        const data: number[] = difference(
            rows.map((e) => {
                return e.menu_id;
            }),
            parentIds
        );

        setCheckedKeys([...data]);
    };

    useEffect(() => {
        if (editRow && editRow.id && roleMenuManagementEditVisible) {
            doGetRoleList();
        }
        // ... 获取数据和处理逻辑
    }, [roleMenuManagementEditVisible]);

    const handleSave = async () => {
        setLoading(true);
        let menuIdsCurrent: number[] = [...checkedKeys];
        // 获取选中的父id
        menuListOrigin.forEach((e) => {
            if (checkedKeys.includes(e.id)) {
                menuIdsCurrent.push(e.parent_id);
            }
        });
        menuIdsCurrent = difference(uniq(menuIdsCurrent), [0]);
        console.log('menuIdsCurrent------------', menuIdsCurrent);

        handleDelete(menuIdsCurrent);
        const diff_delete = difference(menuIdsCurrent, menuIdsOrigin);
        console.log('diff_delete------------', menuIdsOrigin, diff_delete);

        if (diff_delete.length) {
            const result = await addRoleBulkMenu({
                role_id: editRow.id,
                menu_ids: diff_delete,
            });
            if (result.code === 200) {
                message.success('保存成功');
            }
        }
        onMenuEditSuccess();
        setLoading(false);
    };

    const handleSetAllChecked = () => {
        // ... 全选逻辑
        setCheckedKeys([...menuRef.current]);
    };

    const handleResetChecked = () => {
        setCheckedKeys([]);
    };

    const onClose = () => {
        setCheckedKeys([]);
        setRoleMenuManagementEditVisible(false);
    };
    // 父节点处于半选中的状态,不会出现在checkedKeys中,但是我们需要
    const onCheck = (checkedKeysValue: any, e: any) => {
        setCheckedKeys([...checkedKeysValue]);
    };
    /**
     * 删除角色菜单关系
     * @param menuIdsCurrent
     * @returns {Promise<void>}
     * @constructor
     */
    const handleDelete = async (menuIdsCurrent) => {
        const diff_delete = difference(menuIdsOrigin, menuIdsCurrent);
        // 根据menu_id提取相应的userRole表id，用于删除
        const data = [];
        for (let i = 0; i < diff_delete.length; i++) {
            for (let j = 0; j < roleMenuListData.length; j++) {
                if (roleMenuListData[j].menu_id === diff_delete[i]) {
                    data.push(roleMenuListData[j].id);
                    break;
                }
            }
        }
        if (data.length) {
            await deleteRoleBulkMenu({ ids: uniq(data) });
        }
    };

    return (
        <Modal
            title="菜单管理"
            open={roleMenuManagementEditVisible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    取 消
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                    确 定
                </Button>,
            ]}
        >
            <div>
                <Space>
                    <Button onClick={handleSetAllChecked}>全选</Button>
                    <Button onClick={handleResetChecked}>清空</Button>
                </Space>
                {menuListData && menuListData.length > 0 && (
                    <Tree
                        style={{ marginLeft: '120px', marginTop: '20px' }}
                        checkable
                        defaultExpandAll
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                        treeData={menuListData}
                    />
                )}
            </div>
        </Modal>
    );
};

export default RoleMenuManagementEdit;
