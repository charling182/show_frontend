import React, { useState, useEffect, useRef } from 'react';
import { Button, Tabs, Modal, message, Space } from 'antd';
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    AppstoreOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.less';
import ProjectTemplateEdit from './components/edit/edit';
import { getProjectTemplateList, deleteProjectTemplate } from '@/api';
import ProjectTemplateTask from './components/project-template-task';

const { TabPane } = Tabs;
const { confirm } = Modal;

const ProjectTemplate = () => {
    const [activeTab, setActiveTab] = useState('0');
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState([]);
    // 编辑模板开关
    const [editVisible, setEditVisible] = useState(false);
    // 刷新自增
    const [refresh, setRefresh] = useState(0);
    // 选中的模板数据
    const [selectedTemplate, setSelectedTemplate] = useState({});
    // 打开模板任务开关
    const [taskVisible, setTaskVisible] = useState(false);

    const titles = ['自定义模板', '公共模板'];

    // 模板任务编辑成功
    const handleTaskEditSuccess = (type: 'success' | 'quit') => {
        setTaskVisible(false);
        if (type === 'success') {
            setRefresh(refresh + 1);
        }
    };

    // 项目模板编辑成功事件
    const handleEditSuccess = (type: 'success' | 'quit') => {
        setEditVisible(false);
        setRefresh(refresh + 1);
    };

    useEffect(() => {
        getList();
    }, [activeTab, refresh]);

    async function getList() {
        console.log('获取列表', activeTab);

        setLoading(true);
        try {
            const {
                data: { rows },
            } = await getProjectTemplateList({
                is_custom: activeTab === '0' ? 1 : 0,
                limit: 1000,
                offset: 0,
            });
            setListData(rows);
        } catch (error) {
            message.error('获取列表失败');
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (row: any, e?: any) => {
        //取消按钮的聚焦
        e ? e.currentTarget.blur() : '';
        setSelectedTemplate(row);
        setEditVisible(true);
    };

    function handleShowTasks(row, e) {
        //取消按钮的聚焦
        e.currentTarget.blur();
        setSelectedTemplate(row);
        setTaskVisible(true);
    }

    function handleDelete(row, e) {
        //取消按钮的聚焦
        e.currentTarget.blur();
        confirm({
            title: '你确定要删除当前项吗?',
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                try {
                    await deleteProjectTemplate({ ids: [row.id] });
                    message.success('删除成功');
                    setRefresh(refresh + 1);
                } catch (error) {
                    message.error('删除失败');
                }
            },
        });
    }

    return (
        <div className={styles['project-template']}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                {titles.map((title, index) => (
                    <TabPane tab={title} key={index.toString()}>
                        <div className={styles.list}>
                            {listData.map((item) => (
                                <div key={item.id} className={styles['item-list']}>
                                    <div className={styles['item-img']}>
                                        <img
                                            style={{ width: '50px', height: '50px' }}
                                            src={item.cover}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className={styles['item-info']}>
                                        <div className={styles.name}>{item.name}</div>
                                        <div
                                            className={`${styles['color-light']} ${styles['intro']}`}
                                        >
                                            {item.intro}
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles['color-light']} ${styles['item-tasks']}`}
                                    >
                                        {item.project_template_tasks.map((task, index) => (
                                            <span key={task.id}>
                                                {task.name}
                                                {index !==
                                                    item.project_template_tasks.length - 1 && (
                                                    <ArrowRightOutlined
                                                        style={{ margin: '0 8px' }}
                                                    />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    {index === 0 && (
                                        <Space className={styles['item-control']}>
                                            <Button
                                                icon={<AppstoreOutlined />}
                                                shape="circle"
                                                size="small"
                                                onClick={(e) => handleShowTasks(item, e)}
                                            />
                                            <Button
                                                icon={<EditOutlined />}
                                                shape="circle"
                                                size="small"
                                                onClick={(e) => handleEdit(item, e)}
                                            />
                                            <Button
                                                icon={<DeleteOutlined />}
                                                shape="circle"
                                                size="small"
                                                onClick={(e) => handleDelete(item, e)}
                                            />
                                        </Space>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabPane>
                ))}
            </Tabs>
            <Button
                className={styles['create-template']}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleEdit(null)}
            >
                创建项目模板
            </Button>
            <ProjectTemplateEdit
                editVisible={editVisible}
                selectedTemplate={selectedTemplate}
                handleEditSuccess={handleEditSuccess}
            />
            <ProjectTemplateTask
                taskVisible={taskVisible}
                selectedTemplate={selectedTemplate}
                handleTaskEditSuccess={handleTaskEditSuccess}
            />
            {/* <Modal
                title={`「${currentTemplate.name}」任务列表`}
                visible={dialogVisible}
                onCancel={() => setDialogVisible(false)}
            >
                {dialogVisible && <ProjectTemplateTask templateId={currentTemplate.id} onFetchData={getList} />}
            </Modal> */}
        </div>
    );
};

ProjectTemplate.menu = {
    name: '项目模板',
    icon: 'SmileOutlined',
};

ProjectTemplate.order = 3;

export default ProjectTemplate;
