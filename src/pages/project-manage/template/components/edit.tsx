import React, { useState, useRef } from 'react';
import { Button, Form, Input, Modal } from 'antd';
// import { createProjectTemplate, editProjectTemplate } from '@/api/projectTemplateManagement';
// import CoverImage from '@/components/CoverImage';
import styles from './ProjectTemplateEdit.module.css';

const ProjectTemplateEdit = ({ templateData, fetchData }) => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [coverUrl, setCoverUrl] = useState('');

    const resetForm = () => {
        form.resetFields();
        setCoverUrl('');
    };

    const showEditModal = (data) => {
        if (data) {
            setTitle('编辑模板');
            form.setFieldsValue(data);
            setCoverUrl(data.cover);
        } else {
            setTitle('添加模板');
        }
        setModalVisible(true);
    };

    const handleCancel = () => {
        resetForm();
        setModalVisible(false);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (title === '添加模板') {
            if (!coverUrl) {
                // values.cover = await getRandomImgPath(); // 请添加这个方法的实现
            }
            // const response = await createProjectTemplate(values);
            // 这里可能需要处理response数据
        } else {
            // const response = await editProjectTemplate(values);
            // 这里可能需要处理response数据
        }
        fetchData();
        handleCancel();
    };

    const handleUpload = (url) => {
        setCoverUrl(url);
        form.setFieldsValue({ cover: url });
    };

    return (
        <div className={styles['project-template-edit']}>
            <Button onClick={() => showEditModal(templateData)}>编辑模板</Button>
            <Modal title={title} visible={modalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Cover" name="cover">
                        {/* <CoverImage cover={coverUrl} onUploaded={handleUpload} /> */}
                    </Form.Item>
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: '请输入模板名称' }]}
                    >
                        <Input placeholder="模板名称（必须）" />
                    </Form.Item>
                    <Form.Item label="简介" name="intro">
                        <Input.TextArea rows={2} placeholder="模板简介" />
                    </Form.Item>
                </Form>
                <div className={styles['dialog-footer']}>
                    <Button type="primary" onClick={handleSave}>
                        确 定
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectTemplateEdit;
