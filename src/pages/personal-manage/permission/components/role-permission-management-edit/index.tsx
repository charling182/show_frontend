import React, { useState, useEffect, useRef } from 'react';
import { Modal, Tree, Button, Form, message, Space } from 'antd';
import {
    getPermissionList,
    addRoleBulkPermission,
    deleteRoleBulkPermission,
    getRolePermission,
} from '@/api'; // 请根据您的项目路径进行调整
import { uniq, difference, groupBy } from 'lodash';

const RoleMenuManagementEdit = ({
    rolePermissionManagementEditVisible,
    setRolePermissionManagementEditVisible,
    onPermissionEditSuccess = () => {},
    editRow,
}) => {
    const [loading, setLoading] = useState(false);
    const [permissionListData, setPermissionListData] = useState<any[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [rolePermissionListData, setRolePermissionListData] = useState<any[]>([]);
    const [parentKeys, setParentKeys] = useState<number[]>([]);
    const [permissionIdsOrigin, setPermissionIdsOrigin] = useState<number[]>([]);

    const menuRef = useRef(null);
    const menuListRef = useRef(null);

    const doGetRoleList = async () => {
        const {
            data: { rows, count },
        } = await getPermissionList({ limit: 1000, offset: 0 });
        let allMenuIds: number[] = [];
        const keys: number[] = [];
        const groupByData = groupBy(rows, 'mark');
        const permissionListData = Object.keys(groupByData).map((e, index) => {
            let title = '';
            groupByData[e] = groupByData[e].map((ee) => {
                allMenuIds.push(ee.id);
                title = ee.mark_name;
                return {
                    ...ee,
                    title: ee.name,
                    key: ee.id,
                };
            });
            const key = 10000 + index;
            keys.push(key);
            return {
                title,
                key,
                children: groupByData[e],
            };
        });
        menuRef.current = allMenuIds;
        menuListRef.current = rows;
        setParentKeys([...keys]);
        setPermissionListData(permissionListData);
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
        } = await getRolePermission({ role_id: row.id, limit: 1000, offset: 0 });
        setRolePermissionListData(rows);
        // // 获取所有菜单的父节点
        // let parentIds: number[] = [];
        // menuListRef.current.map((e) => {
        //   parentIds.push(e.parent_id);
        // });
        // parentIds = difference(uniq(parentIds), [0]);
        // // // // 获取所有菜单的子节点
        // let childrenIds: number[] = [];
        // menuListRef.current.map((e) => {
        //   childrenIds.push(e.id);
        // });
        // // // 原当前角色菜单所有节点id
        setPermissionIdsOrigin(
            rows.map((e) => {
                return e.permission_id;
            })
        );
        // // 原当前角色菜单所有子节点id,一旦父节点被选中,子节点也会被选中,可实际上我们可能只是拥有父节点以及父节点下的某些子节点
        // // 所以我们需要将父节点的id从节点中剔除,再真正调用接口时,再传子节点以及父节点
        // const data: number[] = difference(
        //   rows.map((e) => {
        //     return e.menu_id;
        //   }),
        //   parentIds,
        // );

        setCheckedKeys(
            rows.map((e) => {
                return e.permission_id;
            })
        );
    };

    useEffect(() => {
        if (editRow && editRow.id && rolePermissionManagementEditVisible) {
            doGetRoleList();
        }
        // ... 获取数据和处理逻辑
    }, [rolePermissionManagementEditVisible]);

    const handleSave = async () => {
        setLoading(true);
        // 不需要父节点id
        let menuIdsCurrent: number[] = [...difference(uniq(checkedKeys), parentKeys)];
        handleDelete(menuIdsCurrent);
        const diff_delete = difference(menuIdsCurrent, permissionIdsOrigin);

        if (diff_delete.length) {
            const result = await addRoleBulkPermission({
                role_id: editRow.id,
                permission_ids: diff_delete,
            });
            if (result.code === 200) {
                message.success('保存成功');
            }
        }
        onPermissionEditSuccess();
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
        setRolePermissionManagementEditVisible(false);
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
        const diff_delete = difference(permissionIdsOrigin, menuIdsCurrent);
        // 根据menu_id提取相应的userRole表id，用于删除
        const data = [];
        for (let i = 0; i < diff_delete.length; i++) {
            for (let j = 0; j < rolePermissionListData.length; j++) {
                if (rolePermissionListData[j].permission_id === diff_delete[i]) {
                    data.push(rolePermissionListData[j].id);
                    break;
                }
            }
        }
        if (data.length) {
            await deleteRoleBulkPermission({ ids: uniq(data) });
        }
    };

    return (
        <Modal
            title="菜单管理"
            open={rolePermissionManagementEditVisible}
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
                {permissionListData && permissionListData.length > 0 && (
                    <Tree
                        style={{ marginLeft: '120px', marginTop: '20px' }}
                        checkable
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                        treeData={permissionListData}
                    />
                )}
            </div>
        </Modal>
    );
};

export default RoleMenuManagementEdit;
