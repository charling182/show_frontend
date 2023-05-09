import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { createDepartment, updateDepartment } from '@/api';

const { Item } = Form;

const DepartmentOperation = ({
    isCreateDepartment = false,
    departmentData = {},
    visible,
    setVisible,
    onDepartmentSuccess = () => {},
}) => {
    const [form] = Form.useForm();
    const title = isCreateDepartment ? '创建部门' : '编辑部门';
    const buttonName = isCreateDepartment ? '创建' : '编辑';

    useEffect(() => {
        if (!isCreateDepartment) {
            form.setFieldsValue(departmentData);
        }
    }, [departmentData, form, isCreateDepartment]);

    const handleClose = () => {
        setVisible(false);
        form.resetFields();
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                const { name, sort } = values;
                let formData: types.department.updateDepartmentParams = {
                    name,
                    sort,
                    parent_id: 0,
                };
                if (isCreateDepartment) {
                    const result = await createDepartment(formData);
                    if (result.code === 200) {
                        message.success('创建成功');
                        onDepartmentSuccess();
                    }
                } else {
                    formData.id = departmentData.id;
                    const result = await updateDepartment(formData);
                    if (result.code === 200) {
                        message.success('编辑成功');
                        onDepartmentSuccess();
                    }
                }
                handleClose();
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    };

    return (
        <div className="department-operation">
            <Modal title={title} open={visible} width={400} onCancel={handleClose} footer={null}>
                <div className="wrap-content">
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        form={form}
                        initialValues={departmentData}
                        onFinish={handleSubmit}
                    >
                        <Item
                            label="部门名称"
                            name="name"
                            rules={[
                                { required: true, message: '请输入部门名称' },
                                { min: 2, max: 60, message: '长度在 2 到 60 个字符' },
                            ]}
                        >
                            <Input />
                        </Item>
                        <Item label="排序" name="sort">
                            <InputNumber style={{ width: '100%' }} />
                        </Item>
                        <Item wrapperCol={{ offset: 6, span: 12 }}>
                            <Button type="primary" onClick={handleSubmit}>
                                {buttonName}
                            </Button>
                        </Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default DepartmentOperation;
