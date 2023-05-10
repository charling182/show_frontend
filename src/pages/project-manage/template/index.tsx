// import React from 'react';

// import styles from './index.less';

// const Template = () => {
//     return (
//         <div>
//             <h1>项目模板</h1>
//         </div>
//     );
// };

// Template.menu = {
//     name: '项目模板',
//     icon: 'SmileOutlined',
// };

// Template.order = 3;

// export default Template;

import React, { useState, useEffect, useRef } from 'react';
import { Button, Tabs, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
// import ProjectTemplateEdit from "./components/ProjectTemplateEdit";
// import ProjectTemplateTask from "../projectTemplateTask";
// 模拟API
// import { fetchList, deleteItem } from "../api";
import styles from './index.less';

const { TabPane } = Tabs;
const { confirm } = Modal;

const ProjectTemplate = () => {
    const [activeTab, setActiveTab] = useState('0');
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({});
    const editRef = useRef();

    const titles = ['自定义模板', '公共模板'];

    useEffect(() => {
        getList();
    }, [activeTab]);

    async function getList() {
        // setLoading(true);
        // try {
        //     const rows = await fetchList({ is_custom: activeTab === "0" ? 1 : 0, limit: 1000, offset: 0 });
        //     setListData(rows);
        // } catch (error) {
        //     message.error("获取列表失败");
        // } finally {
        //     setLoading(false);
        // }
    }

    function handleEdit(row) {
        // if (row) {
        //     editRef.current.showEdit(row);
        // } else {
        //     editRef.current.showEdit();
        // }
    }

    function handleShowTasks(row) {
        setCurrentTemplate(row);
        setDialogVisible(true);
    }

    function handleDelete(row) {
        confirm({
            title: '你确定要删除当前项吗?',
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                try {
                    // await deleteItem(row.id);
                    message.success('删除成功');
                    getList();
                } catch (error) {
                    message.error('删除失败');
                }
            },
        });
    }

    return (
        <div className={classNames(styles.wrapContentMain, styles.projectTemplate)}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                {titles.map((title, index) => (
                    <TabPane tab={title} key={index.toString()}>
                        <div className={classNames(styles.list, { [styles.loading]: loading })}>
                            {listData.map((item) => (
                                <div key={item.id} className={styles.itemList}>
                                    <div className={styles.itemImg}>
                                        <img src={item.cover} alt={item.name} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.name}>{item.name}</div>
                                        <div className={styles.intro}>{item.intro}</div>
                                    </div>
                                    <div className={styles.itemTasks}>
                                        {item.project_template_tasks.map((task, index) => (
                                            <span key={task.id}>
                                                {task.name}
                                                {index !==
                                                    item.project_template_tasks.length - 1 && (
                                                    <i className="el-icon-right"></i>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    {index === 0 && (
                                        <div className={styles.itemControl}>
                                            <Button
                                                icon="grid"
                                                onClick={() => handleShowTasks(item)}
                                                // 需要检查权限
                                            />
                                            <Button
                                                icon="edit"
                                                onClick={() => handleEdit(item)}
                                                // 需要检查权限
                                            />
                                            <Button
                                                icon="delete"
                                                onClick={() => handleDelete(item)}
                                                // 需要检查权限
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabPane>
                ))}
            </Tabs>
            <Button type="primary" onClick={() => handleEdit(null)} icon="plus">
                创建项目模板
            </Button>
            {/* <ProjectTemplateEdit ref={editRef} onFetchData={getList} /> */}
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
