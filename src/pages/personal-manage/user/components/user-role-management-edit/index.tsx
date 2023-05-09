import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Checkbox, Form, message } from 'antd';
import { getRoleList, getUserRole, createRoleBulk, deleteUserRole } from '@/api';
import { difference } from 'lodash';

const UserRoleManagementEdit = ({
    editRow,
    userRoleManagementVisible,
    setUserRoleManagementVisible,
    onUserRoleManagementEditSuccess = () => {},
}) => {
    const [roleListData, setRoleListData] = useState([]);
    const [userRoleListData, setUserRoleListData] = useState([]);
    const [permissionsOrigin, setPermissionsOrigin] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [permissions, setPermissions] = useState<any[]>([]);

    useEffect(() => {
        if (userRoleManagementVisible && editRow && editRow.id) {
            Promise.all([fetchRoleList(), fetchUserRoleList()]).then(() => {
                // handleGroupChange(form.getFieldValue('permissions'));
            });
        }
    }, [userRoleManagementVisible]);

    const fetchRoleList = async () => {
        const {
            data: { rows },
        } = await getRoleList({ limit: 1000, offset: 0 });
        setRoleListData(rows);
    };

    const fetchUserRoleList = async () => {
        const {
            data: { rows },
        } = await getUserRole({ user_id: editRow.id, limit: 1000, offset: 0 });
        setUserRoleListData(rows);
        const data = rows.map((e) => e.role.id);
        setPermissionsOrigin(data);
        setPermissions(data);
    };

    const handleBulkRoleCreate = async () => {
        const diff_create = difference(permissions, permissionsOrigin);
        if (diff_create.length) {
            const { msg } = await createRoleBulk({
                user_id: editRow.id,
                role_ids: diff_create,
            });
            message.success(msg);
        }
    };

    const handleDelete = async () => {
        const diff_delete = difference(permissionsOrigin, permissions);
        const data = diff_delete.map(
            (id) => userRoleListData.find((userRole) => userRole.role.id === id).id
        );
        if (data.length) {
            const { msg } = await deleteUserRole({ ids: data });
            message.success(msg);
        }
    };

    const handleSave = async () => {
        handleBulkRoleCreate();
        handleDelete();
        onUserRoleManagementEditSuccess();
    };
    const onClose = () => {
        setUserRoleListData([]);
        setRoleListData([]);
        setPermissions([]);
        setPermissionsOrigin([]);
        setCheckAll(false);
        setIndeterminate(true);
        setUserRoleManagementVisible(false);
    };

    const handleCheckAllChange = (e) => {
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        setPermissions(e.target.checked ? roleListData.map((item) => item.id) : []);
    };

    const handleGroupChange = (checkedList) => {
        setCheckAll(checkedList.length === roleListData.length);
        setIndeterminate(checkedList.length > 0 && checkedList.length < roleListData.length);
        setPermissions(checkedList);
    };

    return (
        <Modal
            title="角色管理"
            open={userRoleManagementVisible}
            onCancel={onClose}
            onOk={handleSave}
            width={500}
        >
            <Checkbox
                checked={checkAll}
                indeterminate={indeterminate}
                onChange={handleCheckAllChange}
            >
                全选
            </Checkbox>
            <div style={{ margin: '15px 0' }}></div>
            <Checkbox.Group value={permissions} onChange={handleGroupChange}>
                {roleListData.map((item, index) => (
                    <Checkbox key={index} value={item.id}>
                        {item.name}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Modal>
    );
};

export default UserRoleManagementEdit;
