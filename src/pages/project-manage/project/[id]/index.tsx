import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Menu, Input, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './index.less';
import { SearchOutlined, CheckOutlined, UserOutlined } from '@ant-design/icons';
import { getOneProject, getProjectList } from '@/api';
import { useParams, history } from 'umi';
import TaskList from '../components/task';
import { If } from 'tsx-control-statements/components';
import TaskFilter from '../components/task/components/task-filter';
import AddMemberToProjectDialog from '@/pages/project-manage/list/components/add-member-to-project-dialog';

const ProjectTask = () => {
    // 添加成员显示隐藏
    const [addMemberVisible, setAddMemberVisible] = useState<boolean>(false);
    // 任务列表搜索条件对象
    const [taskListSearchCondition, setTaskListSearchCondition] = useState<any>({});
    // 获取id,别名为projectId
    const { id: projectId }: any = useParams();

    const [userPermissions, setUserPermissions] = useState({});
    const [tabs, setTabs] = useState(['任务']);
    const [userProjectCount, setUserProjectCount] = useState(0);

    const [currentProjectId, setCurrentProjectId] = useState();
    const [projectList, setProjectList] = useState([]);
    const [indexTab, setIndexTab] = useState(0);
    const [keywordProjectName, setKeywordProjectName] = useState('');
    const [currentProject, setCurrentProject] = useState<any>({});

    // const { id: routeId } = useParams();

    const [searchValue, setSearchValue] = useState('');

    const filteredProjects = projectList.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // 获取某个项目信息的方法
    const getProject = async (id) => {
        const res = await getOneProject({ id });
        if (res.code === 200) {
            setCurrentProject(res.data);
            setUserProjectCount(res?.data?.member?.length || 0);
        } else {
            message.error(res.message);
        }
    };
    // 获取所有项目的方法
    const getAllProject = async () => {
        const res = await getProjectList({});
        if (res.code === 200) {
            setProjectList(res.data.rows);
        } else {
            message.error(res.message);
        }
    };

    // 添加成员完成或者退出事件
    const handleAddMemberFinish = (type: 'success' | 'quit') => {
        setAddMemberVisible(false);
    };
    const handleAddUser = () => {
        setAddMemberVisible(true);
    };

    useEffect(() => {
        if (projectId) {
            getProject(projectId);
            getAllProject();
            setIndexTab(0);
        }
    }, [projectId]);

    const handleMenuClick = (item: any) => {
        // history跳转刷新到新的项目详情页面
        history.replace(`/project-manage/project/${item.id}`);
    };
    const menu = (
        <Menu>
            {projectList
                .filter((item) => item.name.includes(keywordProjectName))
                .map((item) => (
                    <Menu.Item onClick={() => handleMenuClick(item)} key={item.id}>
                        <div className={styles['project-task-wrap-dropdown-item']}>
                            <div className={styles['info']}>
                                <img
                                    width={32}
                                    height={32}
                                    style={{ borderRadius: '32px' }}
                                    src={item.cover}
                                    alt=""
                                />
                                <div className={styles['name']}>{item.name}</div>
                            </div>
                            {item.id === currentProject?.id && <CheckOutlined />}
                        </div>
                    </Menu.Item>
                ))}
        </Menu>
    );

    return (
        <div className={styles['project-task']}>
            <div className={styles['wrap-nav']}>
                <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    dropdownRender={() => (
                        <div className={styles['project-task-project-dropdown']}>
                            <div className={styles['input-box']}>
                                <Input
                                    placeholder="搜索"
                                    value={keywordProjectName}
                                    onChange={(e) => setKeywordProjectName(e.target.value)}
                                    className={styles['project-task-wrap-dropdown-input']}
                                    prefix={<SearchOutlined />}
                                />
                            </div>
                            {menu}
                        </div>
                    )}
                >
                    <span className={styles['project-name']}>
                        {currentProject?.name} <DownOutlined />
                    </span>
                </Dropdown>
                <div className={styles['tab']}>
                    {tabs.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles['item-tab']} ${
                                indexTab === index ? styles.active : ''
                            }`}
                            onClick={() => setIndexTab(index)}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                <div className={styles['wrap-controller']}>
                    <TaskFilter
                        projectMembers={currentProject?.members}
                        taskListSearchCondition={taskListSearchCondition}
                        setTaskListSearchCondition={setTaskListSearchCondition}
                    />
                    <Button onClick={handleAddUser} type="link" icon={<UserOutlined />}>
                        <span>{userProjectCount}</span>
                    </Button>
                </div>
            </div>

            <div className={styles['wrap-content']}>
                <If condition={indexTab === 0}>
                    <TaskList
                        taskListSearchCondition={taskListSearchCondition}
                        currentProject={currentProject}
                    />
                </If>
            </div>
            <AddMemberToProjectDialog
                project={currentProject}
                handleAddMemberFinish={handleAddMemberFinish}
                addMemberVisible={addMemberVisible}
            />
        </div>
    );
};
ProjectTask.layout = {
    hideMenu: true, // 自动隐藏页面菜单栏
    // hideNav: true, // 自动隐藏页面顶部导航条
    hideFooter: true, // 自动隐藏页面底部footer
    // 如果把三个都设置为true，可以实现“无布局”效果，在实现login等全屏页面时非常有用
};

export default ProjectTask;
