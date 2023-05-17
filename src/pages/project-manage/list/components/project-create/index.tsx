import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import ImgCrop from 'antd-img-crop';
import { uploadFile, getProjectTemplateList, createProject, updateProject } from '@/api';
import { useModel } from 'umi';

function ProjectCreate({ projectCreateVisible, handleProjectCreateFinish, project }) {
    const { initialState } = useModel('@@initialState');
    const userInfo = initialState || {};
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cover, setCover] = useState<string>('');

    useEffect(() => {
        const loadTemplates = async () => {
            setLoading(true);
            const {
                data: { rows },
            } = await getProjectTemplateList();
            setTemplates(rows);
            setLoading(false);
        };
        loadTemplates();
    }, []);

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // 上传前校验图片
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('你需要上传jpeg或者png图片格式!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片必须小于5MB!');
            return false;
        }
        uploadImage(file);
        return false; // 阻止 Upload 组件自动上传文件
    };

    // 图片上传方法
    const uploadImage = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        const { code, data } = await uploadFile(formData);
        setCover(data.path);
        // setCover(URL.createObjectURL(file));
        // 设置表单中的 avatar 字段值
        form.setFieldValue('avatar', data.path);
    };

    const onFinish = async (values) => {
        setLoading(true);
        values.cover = cover;
        values.manager_id = userInfo.id;
        try {
            if (project.id) {
                await updateProject(values);
                message.success('项目已成功编辑');
            } else {
                await createProject(values);
                message.success('项目已成功创建');
            }
            handleProjectCreateFinish('success');
        } catch (error) {
            message.error('操作失败，请稍后再试');
        }
        setLoading(false);
    };
    const onCancel = () => {
        handleProjectCreateFinish('quit');
    };

    return (
        <Modal
            open={projectCreateVisible}
            title={project ? '编辑项目' : '添加项目'}
            onCancel={onCancel}
            footer={null}
            className={styles['project-create']}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="封面" name="cover">
                    <ImgCrop rotationSlider>
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            {cover ? (
                                <img src={cover} alt="image" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    label="项目名称"
                    name="name"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                >
                    <Input placeholder="项目名称（必须）" />
                </Form.Item>
                <Form.Item
                    label="项目模板"
                    name="project_template_id"
                    rules={[{ required: true, message: '请选择项目模板' }]}
                >
                    <Select placeholder="请选择项目模板（必选）" loading={loading}>
                        {templates.map((template) => (
                            <Select.Option key={template.id} value={template.id}>
                                {template.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="项目简介" name="intro">
                    <Input.TextArea rows={2} placeholder="项目简介" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 21, span: 3 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        确 定
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ProjectCreate;
