import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, InputNumber } from 'antd';
import styles from './index.less';
import { createProjectTemplateTask, updateProjectTemplateTask } from '@/api';

export default function ProjectTemplateTaskEdit({
    editVisible,
    selectedTemplate,
    selectedTask,
    handleEditSuccess,
}) {
    const [form] = Form.useForm();
    const [dialogFormVisible, setDialogFormVisible] = useState(false);
    const title: string = selectedTask && selectedTask.id ? '编辑模板任务' : '添加模板任务';
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        project_template_id: '',
        sort: 0,
    });

    const close = () => {
        form.resetFields();
        handleEditSuccess('quit');
    };

    const save = () => {
        form.validateFields()
            .then(async (values) => {
                console.log('values', values);
                values.project_template_id = selectedTemplate.id;
                if (selectedTask?.id) {
                    values.id = selectedTask.id;
                    const { code } = await updateProjectTemplateTask(values);
                    if (code === 200) {
                        message.success('修改成功');
                        handleEditSuccess('success');
                    }
                } else {
                    const { code } = await createProjectTemplateTask(values);
                    if (code === 200) {
                        message.success('添加成功');
                        handleEditSuccess('success');
                    }
                }
                form.resetFields();
            })
            .catch((errorInfo) => {
                return false;
            });
    };
    // 判断为编辑模式,将任务数据赋值给form
    useEffect(() => {
        if (editVisible && selectedTask?.id) {
            form.setFieldsValue(selectedTask);
        }
    }, [selectedTask, editVisible]);

    return (
        <Modal title={title} open={editVisible} width={300} onCancel={close} onOk={save}>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="任务名称"
                    name="name"
                    rules={[
                        { required: true, message: '请输入任务名称' },
                        { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
                    ]}
                >
                    <Input placeholder="模板任务名称（必须）" />
                </Form.Item>
                <Form.Item label="排序" name="sort">
                    <InputNumber defaultValue={0} style={{ width: '100%' }} placeholder="排序" />
                </Form.Item>
                <div style={{ color: '#ccc' }}>排序，值越大越靠前，默认0</div>
            </Form>
        </Modal>
    );
}
