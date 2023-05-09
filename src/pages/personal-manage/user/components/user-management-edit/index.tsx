import { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, message, Button } from 'antd';
import { putChangeUserData } from '@/api';

const { Item } = Form;

const UserManagementEdit = ({
    editRow,
    userManagementVisible,
    setUserManagementVisible,
    onUserManagementEditSuccess = () => {},
}) => {
    const [form] = Form.useForm();
    const [title, setTitle] = useState('');
    const [dialogFormVisible, setDialogFormVisible] = useState(false);

    const rules = {
        username: [
            { required: true, message: '请输入用户名' },
            { min: 2, max: 60, message: '长度在 2 到 60 个字符' },
        ],
        nickname: [{ min: 2, max: 60, message: '长度在 2 到 60 个字符' }],
        email: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的电子邮件地址' },
        ],
        phone: [{ pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }],
    };

    const close = () => {
        form.resetFields();
        setUserManagementVisible(false);
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            const { code } = await putChangeUserData({ ...values, id: editRow.id });
            if (code === 200) {
                message.success('修改成功');
                onUserManagementEditSuccess();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (editRow && editRow.id) {
            form.setFieldsValue(editRow);
        }
    }, [editRow]);

    return (
        <Modal
            title="编辑用户"
            open={userManagementVisible}
            onCancel={close}
            onOk={save}
            destroyOnClose
        >
            <Form
                form={form}
                // onFinish={save}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
            >
                <Item label="用户名" name="username" rules={rules.username}>
                    <Input disabled />
                </Item>
                <Item label="昵称" name="nickname" rules={rules.nickname}>
                    <Input />
                </Item>
                <Item label="邮箱" name="email" rules={rules.email}>
                    <Input disabled />
                </Item>
                <Item label="手机" name="phone" rules={rules.phone}>
                    <Input />
                </Item>
                <Item label="公司" name="company">
                    <Input />
                </Item>
                <Item label="城市" name="city">
                    <Input />
                </Item>
                <Form.Item label="状态" name="state">
                    <Radio.Group>
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>停用</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserManagementEdit;
