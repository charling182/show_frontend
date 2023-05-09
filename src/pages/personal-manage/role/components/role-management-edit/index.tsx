import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createRole, editRole } from '@/api';

const RoleManagementEdit = ({
    roleManagementEditVisible,
    setRoleManagementEditVisible,
    onEditSuccess = () => {},
    editRow,
}) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            if (editRow && editRow.id) {
                await editRole({ ...values, id: editRow.id });
                message.success('编辑成功');
            } else {
                await createRole(values);
                message.success('添加成功');
            }
            onEditSuccess();
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setRoleManagementEditVisible(false);
    };

    useEffect(() => {
        if (editRow && editRow.id) {
            form.setFieldsValue(editRow);
        } else {
            form.resetFields();
        }
    }, [editRow]);

    return (
        <Modal
            title={editRow && editRow.id ? '编辑' : '添加'}
            open={roleManagementEditVisible}
            onCancel={handleClose}
            onOk={handleOk}
        >
            <Form form={form}>
                <Form.Item
                    value
                    label="角色名"
                    name="name"
                    rules={[
                        { required: true, trigger: 'blur', message: '请输入角色名称' },
                        {
                            min: 1,
                            max: 50,
                            trigger: 'blur',
                            message: '长度在 1 到 50 个字符',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleManagementEdit;
