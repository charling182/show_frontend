import React, { useState, useEffect } from 'react';
import {
    Modal,
    Input,
    Menu,
    message,
    notification,
    Row,
    Col,
    Dropdown,
    DatePicker,
    Tag,
} from 'antd';
import styles from './index.less';
import { useModel } from 'umi';
import { IconFont } from '@/components/iconfont';
import { Choose, When, Otherwise, For, If } from 'tsx-control-statements/components';
import BtnTooltip from '@/components/btn-tooltip';
import { userTaskLikesChange, updateTask } from '@/api';
import {
    CloseOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import ExecutorSelect from '@/components/executor-select';
import dayjs from 'dayjs';
import WorkHour from '../work-hour';
import Participator from '../participator';
import TaskLog from '../task-log';

const { RangePicker }: any = DatePicker;
const { confirm } = Modal;

const TaskDialog = ({
    taskDialogVisible = false,
    selectedTask = {},
    handleTaskDialogSuccess,
    isCurrentProjectMember = false,
    currentProject = {},
}: any) => {
    // 现在的task数据
    const [currentTask, setCurrentTask] = useState<any>({});

    const { taskPrioritysList, taskStatusList }: any = useModel('useTask');

    const handleCancel = () => {
        handleTaskDialogSuccess('quit');
    };
    const handleOk = () => {
        handleTaskDialogSuccess('success');
    };

    /**
     * 复制文本
     * @param text
     */
    const doCopy = (text: string) => {
        const input = document.createElement('input');
        const div = document.createElement('div');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        input.setAttribute('style', 'position: absolute;left: 100000px;');
        div.setAttribute('style', 'position: absolute;width: 0px;height: 0px;overflow: hidden;');
        div.appendChild(input);
        document.body.appendChild(div);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(div);
    };

    const handleDoLike = async (e) => {
        e.currentTarget.blur();
        const { code } = await userTaskLikesChange({
            project_id: currentTask.project_id,
            task_id: currentTask.id,
        });
        if (code === 200) {
            message.success('操作成功');
            handleTaskDialogSuccess('success');
        }
    };

    const handleMovetoRecycle = () => {
        // 移到回收站
        confirm({
            title: '您确定要把该任务移到回收站吗？',
            icon: <ExclamationCircleOutlined />,
            content: '移动到回收站后，该任务将不会在任务列表中显示',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                const { code } = await updateTask({
                    ...currentTask,
                    is_recycle: 1,
                });
                if (code === 200) {
                    message.success('操作成功');
                    handleTaskDialogSuccess('success');
                }
            },
            onCancel() {
                //操作取消
                message.info('操作取消');
            },
        });
    };

    const commandMore = async ({ key }: any) => {
        const { code } = await updateTask({
            ...currentTask,
            task_state_id: Number(key),
        });
        if (code === 200) {
            handleTaskDialogSuccess('success');
        }
    };

    const commandPriorityMore = async ({ key }: any) => {
        const { code } = await updateTask({
            ...currentTask,
            task_priority_id: Number(key),
        });
        if (code === 200) {
            handleTaskDialogSuccess('success');
        }
    };

    const handleCopyTaskLink = () => {
        doCopy(`${window.location.origin}/project-manage/project/${currentTask.project_id}`);
        notification.info({
            message: '可粘贴到地址栏中，快速打开此任务',
            description: '复制链接成功',
        });
    };

    const handleBlur = async () => {
        const { code } = await updateTask({
            ...currentTask,
        });
        if (code === 200) {
            handleTaskDialogSuccess('success');
        }
    };

    const handleChangeTaskName = (e: any) => {
        setCurrentTask({
            ...currentTask,
            name: e.target.value,
        });
    };

    const executorSelect = async (user) => {
        const { code } = await updateTask({
            ...currentTask,
            executor_id: user.id,
        });
        if (code === 200) {
            handleTaskDialogSuccess('success');
        }
    };

    const handleTimeChange = async (date: any, dateString: any) => {
        const { code } = await updateTask({
            ...currentTask,
            start_date: dateString[0],
            end_date: dateString[1],
        });
        if (code === 200) {
            handleTaskDialogSuccess('success');
        }
    };

    useEffect(() => {
        if (taskDialogVisible && selectedTask) {
            setCurrentTask({
                ...selectedTask,
            });
        }
    }, [taskDialogVisible, selectedTask]);
    return (
        <Modal
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <IconFont
                            type={selectedTask?.type?.icon}
                            style={{
                                color: selectedTask?.type?.color,
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                        {selectedTask?.type?.name}
                    </div>
                    <div>
                        <BtnTooltip
                            icon={<IconFont type="link" style={{ fontSize: '18px' }} />}
                            tooltipContent="复制链接"
                            type="text"
                            btnStyle={{ marginRight: '8px' }}
                            onClick={handleCopyTaskLink}
                        ></BtnTooltip>
                        <BtnTooltip
                            tooltipContent={'点个赞'}
                            btnStyle={{ marginRight: '8px' }}
                            icon={<IconFont type="dianzan" style={{ fontSize: '18px' }} />}
                            type={currentTask.likers && currentTask.likers.length ? 'link' : 'text'}
                            onClick={handleDoLike}
                        >
                            <If condition={currentTask.likers && currentTask.likers.length}>
                                <span style={{ marginLeft: '4px' }}>
                                    {currentTask.likers && currentTask.likers.length}
                                </span>
                            </If>
                        </BtnTooltip>
                        <BtnTooltip
                            icon={<DeleteOutlined style={{ fontSize: '16px' }} />}
                            tooltipContent="移到回收站"
                            type="text"
                            btnStyle={{ marginRight: '8px' }}
                            onClick={handleMovetoRecycle}
                        ></BtnTooltip>
                        <CloseOutlined className={styles['close-icon']} onClick={handleCancel} />
                    </div>
                </div>
            }
            width={1200}
            open={taskDialogVisible}
            // onCancel={handleCancel}
            // onOk={handleOk}
            footer={null}
            closable={false}
            className={styles['task-dialog']}
        >
            <div>
                <Row>
                    <Col span={14}>
                        <div className={styles['wrap-task']}>
                            <div
                                className={`${styles['wrap-name']} ${
                                    currentTask.is_done === 1 ? styles['wrap-name-done'] : ''
                                }`}
                            >
                                <Input.TextArea
                                    value={currentTask.name}
                                    disabled={!isCurrentProjectMember}
                                    onChange={handleChangeTaskName}
                                    bordered={false}
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className={`${styles['wrap-item']}`}>
                                <div className={styles['label']}>
                                    <IconFont
                                        className={`${styles['iconfont']}`}
                                        type="xuanzhong"
                                    />
                                    完成状态
                                </div>
                                <div className={styles['content']}>
                                    <Dropdown
                                        trigger={['click']}
                                        dropdownRender={() => (
                                            <Menu
                                                onClick={commandMore}
                                                className={styles['wrap-item-menu']}
                                            >
                                                <For each="item" of={taskStatusList} index="index">
                                                    <Menu.Item
                                                        className={styles['menu-item']}
                                                        key={item.id}
                                                    >
                                                        <IconFont
                                                            type={item.icon}
                                                            style={{
                                                                color: item.color,
                                                                fontSize: '16px',
                                                            }}
                                                        />
                                                        <span style={{ margin: '0 4px' }}>
                                                            {item.name}
                                                        </span>
                                                    </Menu.Item>
                                                </For>
                                            </Menu>
                                        )}
                                    >
                                        <div>
                                            <IconFont
                                                type={currentTask?.state?.icon}
                                                style={{
                                                    color: currentTask?.state?.color,
                                                    fontSize: '16px',
                                                }}
                                            />
                                            <span style={{ margin: '0 4px' }}>
                                                {currentTask?.state?.name}
                                            </span>
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className={styles['wrap-item']}>
                                <div className={styles['label']}>
                                    <UserOutlined className={`${styles['iconfont']}`} /> 执行者
                                </div>
                                <div className={styles['content']}>
                                    <ExecutorSelect
                                        currentProject={currentProject}
                                        executorId={currentTask?.executor?.id}
                                        isCurrentProjectMember={isCurrentProjectMember}
                                        showNoOne={true}
                                        onSelect={executorSelect}
                                    />
                                </div>
                            </div>
                            <div className={styles['wrap-item']}>
                                <div className={styles['label']}>
                                    <IconFont className={`${styles['iconfont']}`} type="date" />
                                    时间
                                </div>
                                <div className={styles['content']}>
                                    <RangePicker
                                        valelue={[
                                            dayjs(currentTask.start_date),
                                            dayjs(currentTask.end_date),
                                        ]}
                                        size="small"
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [
                                                dayjs('00:00:00', 'HH:mm:ss'),
                                                dayjs('11:59:59', 'HH:mm:ss'),
                                            ],
                                        }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </div>
                            <div className={styles['wrap-item']}>
                                <div className={styles['label']}>
                                    <IconFont
                                        className={`${styles['iconfont']}`}
                                        type="youxianji"
                                    />
                                    优先级
                                </div>
                                <div className={styles['content']}>
                                    <Dropdown
                                        trigger={['click']}
                                        dropdownRender={() => (
                                            <Menu
                                                onClick={commandPriorityMore}
                                                className={styles['wrap-item-menu']}
                                            >
                                                <For
                                                    each="item"
                                                    of={taskPrioritysList}
                                                    index="index"
                                                >
                                                    <Menu.Item
                                                        className={styles['menu-item']}
                                                        key={item.id}
                                                    >
                                                        <Tag color={item.color}>{item.name}</Tag>
                                                    </Menu.Item>
                                                </For>
                                            </Menu>
                                        )}
                                    >
                                        <div>
                                            <Tag color={currentTask?.priority?.color}>
                                                {currentTask?.priority?.name}
                                            </Tag>
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className={styles['wrap-item']}>
                                <div className={styles['label']}>
                                    <IconFont className={`${styles['iconfont']}`} type="beizhu" />
                                    备注
                                </div>
                                <div>
                                    <Input.TextArea
                                        placeholder="备注"
                                        value={currentTask.remark}
                                        onChange={(e) =>
                                            setCurrentTask({
                                                ...currentTask,
                                                remark: e.target.value,
                                            })
                                        }
                                        disabled={!isCurrentProjectMember}
                                        autoSize
                                        bordered={false}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <WorkHour
                                currentTask={currentTask}
                                currentProject={currentProject}
                                isCurrentProjectMember={isCurrentProjectMember}
                            />
                        </div>
                    </Col>
                    <Col span={10}>
                        <div className={styles['wrap-dynamic']}>
                            <Participator
                                currentTask={currentTask}
                                currentProject={currentProject}
                            />
                            <TaskLog currentTask={currentTask} currentProject={currentProject} />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default TaskDialog;
