import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import styles from './edit.less';
import { createProjectTemplate, updateProjectTemplate, uploadFile } from '@/api';

const ProjectTemplateEdit = ({ selectedTemplate, editVisible, handleEditSuccess }) => {
    const [form] = Form.useForm();
    // 通过selectedTemplate是否有id来判断是编辑还是新增
    const title: string = selectedTemplate && selectedTemplate.id ? '编辑模板' : '添加模板';
    const [cover, setCover] = useState<string>('');

    const uploadButton = (
        <div>
            {<PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const resetForm = () => {
        form.resetFields();
        setCover('');
    };

    const handleCancel = () => {
        resetForm();
        handleEditSuccess('quit');
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (selectedTemplate?.id) {
            values.cover = cover;
            values.id = selectedTemplate?.id;
            const { code } = await updateProjectTemplate(values);
            if (code === 200) {
                message.success('编辑成功');
                resetForm();
                handleEditSuccess('success');
            }
        } else {
            // 将cover字段添加到values中
            values.cover = cover;
            const { code } = await createProjectTemplate(values);
            if (code === 200) {
                message.success('添加成功');
                resetForm();
                handleEditSuccess('success');
            }
        }
    };

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
    };
    useEffect(() => {
        if (editVisible && selectedTemplate?.id) {
            // 如果是编辑模板, 把数据传给form表单
            form.setFieldsValue(selectedTemplate);
            setCover(selectedTemplate?.cover);
        }
    }, [selectedTemplate, editVisible]);

    return (
        <div className={styles['project-template-edit']}>
            <Modal title={title} open={editVisible} onCancel={handleCancel} onOk={handleSave}>
                <Form form={form} layout="vertical">
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
            </Modal>
        </div>
    );
};

export default ProjectTemplateEdit;
