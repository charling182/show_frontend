import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

function ProjectCreate({ showCreate, hideCreate, fetchProjects, project = null }) {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cover, setCover] = useState('');

    useEffect(() => {
        const loadTemplates = async () => {
            setLoading(true);
            const templates = await getList();
            setTemplates(templates);
            setLoading(false);
        };
        loadTemplates();
    }, []);

    const handleUpload = ({ fileList }) => {
        // read from response and show file link
        const url = fileList.file.response.url;
        setCover(url);
    };

    const onFinish = async (values) => {
        setLoading(true);
        values.cover = cover;
        try {
            if (project) {
                await doEdit(values);
                message.success('项目已成功编辑');
            } else {
                if (values.cover === '') {
                    values.cover = await getRandomImgPath();
                }
                await doCreate(values);
                message.success('项目已成功创建');
            }
            fetchProjects();
            hideCreate();
        } catch (error) {
            message.error('操作失败，请稍后再试');
        }
        setLoading(false);
    };

    return (
        <Modal
            open={showCreate}
            title={project ? '编辑项目' : '添加项目'}
            onCancel={hideCreate}
            footer={null}
            className={styles['role-management']}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="封面" name="cover">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="//jsonplaceholder.typicode.com/posts/"
                        onChange={handleUpload}
                    >
                        {cover ? (
                            <img src={cover} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            <UploadOutlined />
                        )}
                    </Upload>
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        确 定
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ProjectCreate;
