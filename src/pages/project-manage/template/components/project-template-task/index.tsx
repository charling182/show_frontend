import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Spin, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getProjectTemplateTask, deleteProjectTemplateTask } from '@/api';
import ProjectTemplateTaskEdit from '../project-template-task-edit';

export default function ProjectTemplateTask({
    taskVisible,
    selectedTemplate,
    handleTaskEditSuccess,
}) {
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState([]);
    // 刷新自增
    const [refresh, setRefresh] = useState(0);
    //任务编辑开关
    const [editVisible, setEditVisible] = useState(false);
    // 选中的任务
    const [selectedTask, setSelectedTask] = useState({});

    // 任务编辑成功事件
    const handleEditSuccess = (type: 'success' | 'quit') => {
        setEditVisible(false);
        if (type === 'success') {
            setRefresh(refresh + 1);
        }
    };

    useEffect(() => {
        if (taskVisible && selectedTemplate?.id) {
            getListData();
        }
    }, [taskVisible, refresh]);

    const getListData = async () => {
        setLoading(true);
        const {
            data: { rows },
        } = await getProjectTemplateTask({
            project_template_id: selectedTemplate?.id,
            prop_order: 'sort',
            order: 'desc',
            limit: 1000,
            offset: 0,
        });
        setLoading(false);
        setListData(rows);
    };

    const handleEdit = (row, e?: any) => {
        // 取消按钮聚焦
        e && e.currentTarget.blur();
        setEditVisible(true);
        setSelectedTask(row);
    };

    const handleDelete = (row, e: any) => {
        e && e.currentTarget.blur();
        Modal.confirm({
            title: '你确定要删除当前项吗',
            onOk: async () => {
                const { code } = await deleteProjectTemplateTask({ ids: [row.id] });
                if (code === 200) {
                    setRefresh(refresh + 1);
                    message.success('删除成功');
                }
            },
        });
    };
    const handleCancel = () => {
        handleTaskEditSuccess('success');
    };

    return (
        <Modal
            title={`「${selectedTemplate?.name}」任务列表`}
            open={taskVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <div className={styles['project-template-task']}>
                <Spin spinning={loading}>
                    <div className={styles['list']}>
                        {listData.map((item_template) => (
                            <div key={item_template.id} className={styles['item-list']}>
                                <div className={styles['item-info']}>
                                    <div className={styles['name']}>{item_template.name}</div>
                                    <div className={styles['intro']}>
                                        排序：{item_template.sort}
                                    </div>
                                </div>
                                <Space className={styles['item-control']}>
                                    <Button
                                        icon={<EditOutlined />}
                                        shape="circle"
                                        size="small"
                                        onClick={(e) => handleEdit(item_template, e)}
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                        shape="circle"
                                        size="small"
                                        onClick={(e) => handleDelete(item_template, e)}
                                    />
                                </Space>
                            </div>
                        ))}
                    </div>
                </Spin>
                <Button
                    className={styles['create-template']}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleEdit}
                >
                    添加任务
                </Button>
            </div>
            <ProjectTemplateTaskEdit
                editVisible={editVisible}
                selectedTask={selectedTask}
                selectedTemplate={selectedTemplate}
                handleEditSuccess={handleEditSuccess}
            />
            {/* <ProjectTemplateTaskEdit
                    ref={editRef}
                    templateId={templateId}
                // TODO: Add onFetchData handler
                /> */}
        </Modal>
    );
}
