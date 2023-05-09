import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
// import { doEdit, permissions as departmentPermissions } from '@/api/departmentManagement';

const DepartmentManagementEdit = (props) => {
    const [form] = Form.useForm();
    const [dialogVisible, setDialogVisible] = useState(false);
    const { title, row } = props;

    const showEdit = () => {
        if (row) {
            form.setFieldsValue(row);
        }
        setDialogVisible(true);
    };

    const close = () => {
        form.resetFields();
        setDialogVisible(false);
    };

    const onFinish = async (values) => {
        // const { msg } = await doEdit(values);
        props.fetchData();
        form.resetFields();
        setDialogVisible(false);
        // message.success(msg);
    };

    return (
        <div>
            <Button onClick={showEdit}>{title}</Button>
            <Modal
                visible={dialogVisible}
                onCancel={close}
                title={title}
                footer={[
                    <Button key="cancel" onClick={close}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" htmlType="submit" form="editForm">
                        确定
                    </Button>,
                ]}
            >
                <Form
                    id="editForm"
                    form={form}
                    onFinish={onFinish}
                    initialValues={row}
                    layout="vertical"
                >
                    <Form.Item
                        label="id"
                        name="id"
                        rules={[{ required: true, message: '请输入id' }]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentManagementEdit;
