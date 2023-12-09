import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, Modal, message } from 'antd';
import { addPermission, updatePermission } from '@/api';

const { Option } = Select;
const { TextArea } = Input;

const PermissionManagementEdit = ({
    permissionManagementEditVisible,
    setPermissionManagementEditVisible,
    editRow,
    onEditSuccess = () => {},
}) => {
    const [form] = Form.useForm();
    const [formName, setFormName] = useState(undefined);

    const close = () => {
        form.resetFields();
        setPermissionManagementEditVisible(false);
    };

    const save = () => {
        form.validateFields()
            .then((values) => {
                // doCreate or doEdit
                console.log(values);
                close();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const formNameChange = (value) => {
        setFormName(value);
        let action;
        switch (value) {
            case '列表':
                action = 'get';
                break;
            case '新增':
                action = 'post';
                break;
            case '详情':
                action = 'get';
                break;
            case '修改':
                action = 'put';
                break;
            case '批量删除':
                action = 'delete';
                break;
        }
        form.setFieldsValue({ name: value, action });
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            if (editRow && editRow.id) {
                await updatePermission({ ...values, id: editRow.id });
                message.success('编辑成功');
            } else {
                await addPermission(values);
                message.success('添加成功');
            }
            onEditSuccess();
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    const handleClose = () => {
        handleReset();
        setPermissionManagementEditVisible(false);
    };
    // 重置表单
    const handleReset = () => {
        form.setFieldsValue({
            mark: undefined,
            mark_name: undefined,
            name: undefined,
            description: undefined,
            state: 1,
            authentication: 1,
            authorization: 1,
            action: 'get',
            url: '/backend/',
        });
    };

    useEffect(() => {
        setFormName(undefined);
        if (editRow && editRow.id) {
            form.setFieldsValue(editRow);
        } else {
            handleReset();
        }
    }, [editRow]);

    return (
        <Modal
            title={editRow && editRow.id ? '编辑' : '添加'}
            open={permissionManagementEditVisible}
            onCancel={handleClose}
            onOk={handleOk}
        >
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                <Form.Item
                    label="标识码"
                    name="mark"
                    rules={[
                        { required: true, message: '请输入标识码' },
                        { max: 60, message: '长度不超过 60 个字符' },
                    ]}
                >
                    <Input placeholder="请输入标识码" />
                </Form.Item>
                <Form.Item
                    label="标识码名"
                    name="mark_name"
                    rules={[
                        { required: true, message: '请输入标识码名' },
                        { max: 60, message: '长度不超过 60 个字符' },
                    ]}
                >
                    <Input placeholder="请输入标识码名" />
                </Form.Item>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[
                        { required: true, message: '请选择名称' },
                        { max: 60, message: '长度不超过 60 个字符' },
                    ]}
                >
                    <Input
                        addonBefore={
                            <Select
                                value={formName}
                                onChange={formNameChange}
                                placeholder="请选择"
                                style={{ width: 100 }}
                            >
                                <Option value="列表">列表</Option>
                                <Option value="新增">新增</Option>
                                <Option value="详情">详情</Option>
                                <Option value="修改">修改</Option>
                                <Option value="批量删除">批量删除</Option>
                            </Select>
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="路径"
                    name="url"
                    rules={[
                        { required: true, message: '请输入路径' },
                        { max: 254, message: '长度不超过 254 个字符' },
                    ]}
                >
                    <Input placeholder="请输入路径" />
                </Form.Item>
                <Form.Item label="动作" name="action">
                    <Radio.Group>
                        <Radio value="get">GET</Radio>
                        <Radio value="post">POST</Radio>
                        <Radio value="put">PUT</Radio>
                        <Radio value="delete">DELETE</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="状态" name="state">
                    <Radio.Group>
                        <Radio value={1}>开启</Radio>
                        <Radio value={0}>关闭</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="需要认证" name="authentication">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="需要授权" name="authorization">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                    rules={[{ max: 254, message: '长度不超过 254 个字符' }]}
                >
                    <TextArea placeholder="请输入描述" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PermissionManagementEdit;
