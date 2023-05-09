import React, { useState, useRef } from 'react';
import { Button, Modal, Form, Input, Radio, message } from 'antd';
import { doCreate, doEdit } from '@/api/menuManagement';

const MenuManagementEdit = ({ row, createChildren, fetchData }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [parentTitle, setParentTitle] = useState('');

    const showEdit = (row, createChildren) => {
        if (!row || createChildren) {
            setTitle('添加');
            if (createChildren) {
                form.setFieldsValue({ ...row, parentId: row.id });
                setParentTitle(row.title);
            } else {
                form.setFieldsValue({ parentId: 0 });
                setParentTitle('');
            }
        } else {
            setTitle('编辑');
            form.setFieldsValue(row);
            setParentTitle('');
        }
        setVisible(true);
    };

    const handleClose = () => {
        form.resetFields();
        setVisible(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (title === '添加') {
                const { msg } = await doCreate(values);
                message.success(msg);
            } else {
                const { msg } = await doEdit(values);
                message.success(msg);
            }
            fetchData();
            handleClose();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <>
            <Button onClick={() => showEdit(row, createChildren)}>
                {title === '添加' ? '添加' : '编辑'}
            </Button>
            <Modal title={title} open={visible} onCancel={handleClose} onOk={handleSave}>
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                    {/* Form items */}
                </Form>
            </Modal>
        </>
    );
};

export default MenuManagementEdit;
