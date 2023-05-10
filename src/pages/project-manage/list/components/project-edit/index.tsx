import React, { useState } from 'react';
import { Form, Input, Button, Modal, Select, Tabs, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

const { TabPane } = Tabs;

const RoleManagement = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className={styles['role-management']}>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                编辑角色
            </Button>
            <Modal
                title="角色编辑"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="概览" key="1">
                        <Form form={form} layout="vertical">
                            <Form.Item label="角色封面">
                                <Button icon={<UploadOutlined />}>上传</Button>
                            </Form.Item>
                            <Form.Item label="角色名称" name="name">
                                <Input placeholder="请输入角色名称" />
                            </Form.Item>
                            <Form.Item label="角色进度 (%)">
                                <Input placeholder="请输入角色进度" />
                            </Form.Item>
                            <Form.Item label="角色简介" name="intro">
                                <Input.TextArea placeholder="介绍一下这个角色" />
                            </Form.Item>
                            <Form.Item label="角色公开性" name="is_private">
                                <Select placeholder="请选择">
                                    <Select.Option value="1">
                                        私有角色（仅角色成员可查看和编辑）
                                    </Select.Option>
                                    <Select.Option value="0">
                                        公开角色（所有人都可通过链接访问，仅角色成员可编辑）
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="角色拥有者">{/* 请在此处添加用户信息 */}</Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="角色偏好" key="2">
                        <Switch defaultChecked />
                    </TabPane>
                    <TabPane tab="更多" key="3">
                        <Button type="danger" onClick={() => console.log('归档角色')}>
                            归档角色
                        </Button>
                        <Button type="danger" onClick={() => console.log('退出角色')}>
                            退出角色
                        </Button>
                        <Button type="danger" onClick={() => console.log('移至回收站')}>
                            移至回收站
                        </Button>
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
    );
};

export default RoleManagement;
