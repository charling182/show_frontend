import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import styles from './index.less';
import { updateTaskList } from '@/api';

const EditorTaskListDialog = ({
    selectedTaskList,
    editorTaskListDialogVisible,
    handleEditorTaskListDialogSuccess,
}) => {
    const [form] = Form.useForm();

    const close = () => {
        form.resetFields();
        handleEditorTaskListDialogSuccess('quit');
    };

    const doEdit = async (values: any) => {
        const { code } = await updateTaskList({
            ...selectedTaskList,
            ...values,
        });
        if (code === 200) {
            message.success('编辑成功');
            handleEditorTaskListDialogSuccess('success');
        }
    };
    const submitForm = () => {
        form.validateFields().then((values) => {
            doEdit(values);
        });
    };
    // 选中的列表数据给form表单
    useEffect(() => {
        if (selectedTaskList && editorTaskListDialogVisible) {
            form.setFieldsValue(selectedTaskList);
        }
    }, [selectedTaskList, editorTaskListDialogVisible]);

    return (
        <Modal
            title="编辑列表"
            open={editorTaskListDialogVisible}
            onCancel={close}
            footer={[
                <Button key="back" onClick={close}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={submitForm}>
                    确认
                </Button>,
            ]}
            className={styles['editor-task-list-dialog']}
        >
            <Form form={form} labelCol={{ span: 5 }} onFinish={submitForm}>
                <Form.Item
                    name="name"
                    label="列表名称："
                    rules={[
                        { required: true, message: '请输入列表名称' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
                    ]}
                >
                    <Input placeholder="列表名称" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditorTaskListDialog;
