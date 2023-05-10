import React, { useState, useEffect } from 'react';
import { Button, Tabs, Progress, Tag, Pagination, Space } from 'antd';
import styles from './index.less'; // 导入样式
import { For } from 'tsx-control-statements/components';
import BtnTooltip from '@/components/btn-tooltip';
import { UserAddOutlined, StarTwoTone, StarOutlined, EditOutlined } from '@ant-design/icons';
import { getProjectList, changeProjectCollect } from '@/api';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import AddMemberToProjectDialog from './components/add-member-to-project-dialog';

// 这里假设了一些功能函数，你需要自行实现它们
// import { getProjects, checkUserPermissions, checkProjectPermissions, editProject, recycleProject, restoreProject, unarchiveProject } from '@/api';

const ProjectList = () => {
    const { initialState } = useModel('@@initialState');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const menuData = [
        {
            tab: '全部项目',
            key: '1',
        },
        {
            tab: '我的收藏',
            key: '2',
        },
        {
            tab: '已归档项目',
            key: '3',
        },
        {
            tab: '回收站',
            key: '4',
        },
    ];
    const [requestParams, setRequestParams] = useState<types.project.getProjectParams>({
        is_recycle: 0,
    });
    // 刷新请求,自增
    const [refresh, setRefresh] = useState<number>(0);
    // 添加成员显示隐藏
    const [addMemberVisible, setAddMemberVisible] = useState<boolean>(false);
    // 选中的项目
    const [selectedProject, setSelectedProject] = useState({});
    // 添加成员完成或者退出事件
    const handleAddMemberFinish = (type: 'success' | 'quit') => {
        setAddMemberVisible(false);
    };
    const dateFormat = (date, template) => {
        return dayjs(date).format(template);
    };

    useEffect(() => {
        // 获取项目列表
        fetchProjects();
    }, [requestParams, refresh]);

    const fetchProjects = async () => {
        setLoading(true);
        const {
            code,
            data: { rows, count },
        } = await getProjectList(requestParams);
        if (code === 200) {
            setProjects(rows);
            setTotal(count);
        }
        setLoading(false);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        let params: {
            is_recycle?: 1 | 0;
            is_archived?: 1 | 0;
            collection?: 1 | 0;
        } = {};
        switch (key) {
            case '1':
                params['is_recycle'] = 0;
                break;
            case '2':
                params = {
                    collection: 1,
                    is_recycle: 0,
                };
                break;
            case '3':
                params['is_archived'] = 1;
                break;
            case '4':
                params['is_recycle'] = 1;
                break;
            default:
                break;
        }
        setRequestParams({ ...params });
    };

    const handlePageChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const handleAddUser = (project, e) => {
        setSelectedProject(project);
        setAddMemberVisible(true);
        e.currentTarget.blur();
    };
    const handleEdit = (project, e) => {
        e.currentTarget.blur();
        // 处理编辑逻辑
    };

    const handleRecycle = (project) => {
        // 处理回收逻辑
    };

    const handleRestore = (project) => {
        // 处理恢复逻辑
    };

    const handleUnarchive = (project) => {
        // 处理取消归档逻辑
    };
    const projectClick = (project) => {};
    const handleCreate = (project) => {};
    const handleStart = async (item, e) => {
        e.currentTarget.blur();
        const { code } = await changeProjectCollect({
            user_id: initialState?.id,
            project_id: item.id,
        });
        if (code === 200) {
            setRefresh(refresh + 1);
        }
    };
    const getMemberTooltipContent = (project) => {
        return initialState?.id === project.manager_id ? '添加成员' : '项目成员';
    };

    return (
        <div className={styles['project-list']}>
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
                {/* 这里只是一个例子，你需要根据你的实际需求来创建 TabPane */}
                <For each="item" of={menuData} index="index">
                    <Tabs.TabPane tab={item.tab} key={item.key}>
                        <div className={styles.list}>
                            {projects.map((project) => (
                                <div key={project.id} className={styles['item-list']}>
                                    <img src={project.cover} />
                                    <div className={styles['item-info']}>
                                        <div className={styles.name}>
                                            <span
                                                className={styles['name-text']}
                                                onClick={() => projectClick(project)}
                                            >
                                                {project.name}
                                            </span>
                                            {project.is_private === 0 && (
                                                <Tag color="green" style={{ marginLeft: 10 }}>
                                                    公开
                                                </Tag>
                                            )}
                                        </div>
                                        <div className={styles.intro}>{project.intro}</div>
                                    </div>
                                    <div className={styles['item-manager']}>
                                        <div>创建日期</div>
                                        <div>{dateFormat(project.created_at, 'YYYY-MM-DD')}</div>
                                    </div>
                                    <div className={styles['item-create-date']}>
                                        <div>创建人</div>
                                        <div>
                                            {project?.creator?.username
                                                ? project?.creator?.username
                                                : '-'}
                                        </div>
                                    </div>
                                    <div className={styles['item-progress']}>
                                        <div>进度</div>
                                        <Progress percent={project.progress} />
                                    </div>
                                    {/* 其他信息 */}
                                    {/* 控制按钮 */}
                                    <Space className={styles['item-control']}>
                                        <BtnTooltip
                                            tooltipContent={getMemberTooltipContent(project)}
                                            icon={<UserAddOutlined />}
                                            onClick={(e) => handleAddUser(project, e)}
                                        />
                                        <BtnTooltip
                                            tooltipContent="项目设置"
                                            icon={<EditOutlined />}
                                            onClick={(e) => handleEdit(project, e)}
                                        />
                                        <BtnTooltip
                                            icon={
                                                project.collector.length ? (
                                                    <StarTwoTone />
                                                ) : (
                                                    <StarOutlined />
                                                )
                                            }
                                            tooltipContent={
                                                project.collector.length ? '取消收藏' : '加入收藏'
                                            }
                                            onClick={(e) => handleStart(project, e)}
                                        />
                                        <BtnTooltip
                                            icon={<UserAddOutlined />}
                                            tooltipContent={'从归档中恢复项目'}
                                            onClick={(e) => handleUnarchive(project, e)}
                                        />
                                        <BtnTooltip
                                            icon={<UserAddOutlined />}
                                            tooltipContent={'从回收站中恢复项目'}
                                            onClick={(e) => handleRestore(project, e)}
                                        />
                                        <BtnTooltip
                                            icon={<UserAddOutlined />}
                                            tooltipContent={'移至回收站'}
                                            onClick={(e) => handleRecycle(project, e)}
                                        />
                                    </Space>
                                </div>
                            ))}
                        </div>
                        {projects.length === 0 && !loading && (
                            <div className={styles.empty}>没有项目</div>
                        )}
                    </Tabs.TabPane>
                </For>
            </Tabs>
            {/* <Button type="primary" icon="plus" onClick={handleCreate} >创建新项目</Button> */}
            {/* 创建项目的组件 */}
            {/* 编辑项目的组件 */}
            {/* 添加成员的组件 */}
            <AddMemberToProjectDialog
                project={selectedProject}
                handleAddMemberFinish={handleAddMemberFinish}
                addMemberVisible={addMemberVisible}
            />
        </div>
    );
};

ProjectList.menu = {
    name: '项目列表',
    icon: 'AuditOutlined',
};

ProjectList.order = 1;

export default ProjectList;
