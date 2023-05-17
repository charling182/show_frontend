import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Modal,
    Select,
    Tabs,
    Switch,
    InputNumber,
    Space,
    message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel } from 'umi';
import BImage from '@/components/b-image';
import { updateProject, exitProject } from '@/api';

const { confirm } = Modal;

const { TabPane } = Tabs;

const RoleManagement = ({ project, projectEditVisible, handleProjectEditFinish }) => {
    const { initialState } = useModel('@@initialState');
    const userInfo = initialState || {};
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 是否为管理人
    const isManager = userInfo.id === project.manager_id;
    // 除去表单外的参数
    const [otherParams, setOtherParams] = useState<any>({});
    // 判断是否为当前项目成员
    const isProjectMember =
        project.member && project.member.some((item) => item.id === userInfo.id);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { code } = await updateProject({ ...values, ...otherParams });
            if (code === 200) {
                message.success('修改成功');
                handleProjectEditFinish('success');
            }
        } catch (errorInfo) {}
    };

    const handleCancel = () => {
        handleProjectEditFinish('quit');
    };

    const switchChange = (checked: boolean) => {
        // 设置setOtherParams的值is_auto_progress,自动更新项目进度
        setOtherParams({ ...otherParams, is_auto_progress: checked ? 1 : 0 });
    };

    const doPigeonhole = async () => {
        const values = await form.validateFields();
        confirm({
            title: '你确定要归档此项目吗',
            async onOk() {
                try {
                    const { code } = await updateProject({
                        ...values,
                        ...otherParams,
                        is_archived: 1,
                    });
                    if (code === 200) {
                        message.success('归档成功');
                        handleProjectEditFinish('success');
                    }
                } catch (errorInfo) {}
            },
        });
    };
    const doQuit = async () => {
        confirm({
            title: '你确定要退出此项目吗',
            async onOk() {
                try {
                    const { code } = await exitProject({
                        user_id: userInfo.id,
                        project_id: project.id,
                    });
                    if (code === 200) {
                        message.success('退出成功');
                        handleProjectEditFinish('success');
                    }
                } catch (errorInfo) {}
            },
        });
    };

    const validatorProgress = (rule, value, callback) => {
        if (value && !(value >= 0 && value <= 100)) {
            callback(new Error('项目进度百分比最小为0，最大为100'));
        } else {
            callback();
        }
    };
    // 移动到回收站
    const doRecycle = async () => {
        const values = await form.validateFields();
        confirm({
            title: '你确定要将此项目移至回收站吗',
            async onOk() {
                try {
                    const { code } = await updateProject({
                        ...values,
                        ...otherParams,
                        is_recycle: 1,
                    });
                    if (code === 200) {
                        message.success('移至回收站成功');
                        handleProjectEditFinish('success');
                    }
                } catch (errorInfo) {}
            },
        });
    };

    useEffect(() => {
        if (project.id && projectEditVisible) {
            form.setFieldsValue(project);
            // 除去表单外的参数
            const { cover, name, progress, intro, is_private, creator, ...rest } = project;
            setOtherParams(rest);
        }
    }, [projectEditVisible]);

    return (
        <Modal
            title="项目编辑"
            open={projectEditVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            className={styles['project-edit']}
        >
            <Tabs tabPosition={'left'} defaultActiveKey="1">
                <TabPane tab="概览" key="1">
                    <Form disabled={!isManager} form={form} layout="vertical">
                        <Form.Item name="cover" label="项目封面">
                            <img src={project.cover} alt="image" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="项目名称"
                            name="name"
                            rules={[
                                { required: true, trigger: 'blur', message: '请输入项目名称' },
                                {
                                    min: 2,
                                    max: 50,
                                    trigger: 'blur',
                                    message: '长度在 2 到 50 个字符',
                                },
                            ]}
                        >
                            <Input disabled={!isManager} placeholder="请输入项目名称" />
                        </Form.Item>
                        <Form.Item
                            name="progress"
                            label="项目进度 (%)"
                            rules={[
                                // { required: true, trigger: 'blur', message: '请输入项目进度' },
                                { required: true, validator: validatorProgress, trigger: 'blur' },
                            ]}
                        >
                            <InputNumber
                                max={100}
                                style={{ width: '100%' }}
                                placeholder="请输入项目进度"
                            />
                        </Form.Item>
                        <Form.Item label="项目简介" name="intro">
                            <Input.TextArea placeholder="介绍一下这个项目" />
                        </Form.Item>
                        <Form.Item label="项目公开性" name="is_private">
                            <Select placeholder="请选择">
                                <Select.Option value={1}>
                                    私有项目（仅项目成员可查看和编辑）
                                </Select.Option>
                                <Select.Option value={0}>
                                    公开项目（所有人都可通过链接访问，仅项目成员可编辑）
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="creator" label="项目拥有者">
                            <div className={styles['user-info']}>
                                <BImage
                                    src={project.creator && project.creator.avatar}
                                    width={40}
                                    height={40}
                                    borderRadius={20}
                                ></BImage>
                                <span style={{ marginLeft: '10px' }}>
                                    {project.creator && project.creator.username}
                                </span>
                            </div>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="项目偏好" key="2">
                    <div className={`${styles['wrap-pane']} ${styles['preference']}`}>
                        <div className={styles['top']}>
                            <span>自动更新项目进度</span>
                            <Switch
                                checked={otherParams.is_auto_progress === 0 ? false : true}
                                style={{ marginLeft: '16px' }}
                                disabled={!isManager}
                                onChange={switchChange}
                            />
                        </div>
                        <div className={styles['bottom']}>
                            {' '}
                            根据当前任务的完成情况自动计算项目进度。
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="更多" key="3">
                    <div className={`${styles['wrap-pane']} ${styles['more']}`}>
                        <div className={styles['title']}>项目操作</div>
                        <div className={`${styles['tip']} ${styles['color-light']}`}>
                            您可以执行以下操作
                        </div>
                        <Space className={styles['wrap-btn']}>
                            <Button onClick={doPigeonhole} disabled={!isManager} danger>
                                归档项目
                            </Button>
                            <Button
                                disabled={isManager || !isProjectMember}
                                danger
                                onClick={() => doQuit()}
                            >
                                退出项目
                            </Button>
                            <Button disabled={!isManager} danger onClick={() => doRecycle()}>
                                移至回收站
                            </Button>
                        </Space>
                    </div>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default RoleManagement;
