import React, { useState } from 'react';
import { Button, Input, Popover, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel } from 'umi';
import { createTaskList } from '@/api';

const CreateTaskList = ({ currentProject, handleCreateSuccess }) => {
    const { initialState } = useModel('@@initialState');
    const userInfo: any = initialState;
    // 判断当前登录人是否为项目成员
    const isCurrentProjectMember = currentProject?.member?.some(
        (item: any) => item.id === userInfo.id
    );
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');

    const currentProjectId = currentProject.id;

    const createClick = async () => {
        const { code } = await createTaskList({
            name,
            project_id: currentProjectId,
        });
        if (code === 200) {
            setVisible(false);
            setName('');
            message.success('任务列表创建成功');
            handleCreateSuccess();
        }
    };
    const handleCheckVisible = (visible: boolean) => {
        if (!visible) {
            setVisible(false);
            setName('');
        }
    };
    const handleOpen = () => {
        if (isCurrentProjectMember) {
            setVisible(true);
        }
    };
    const disabled = !isCurrentProjectMember;
    const content = (
        <div className={`${styles['create-task-list-wrap-form']}`}>
            <div className={styles['title']}>新建任务列表</div>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="列表名称"
                style={{ width: '100%', margin: '15px 0' }}
            />
            <Button
                type="primary"
                style={{ width: '100%', marginBottom: '10px' }}
                disabled={!name.length}
                onClick={createClick}
            >
                创建
            </Button>
        </div>
    );

    return (
        <div className={`${styles['create-task-list']} ${styles['color-light']}`}>
            <div>
                <Popover
                    content={content}
                    trigger="click"
                    open={visible}
                    onOpenChange={handleCheckVisible}
                >
                    <span onClick={handleOpen} className={disabled ? styles.disabled : ''}>
                        <PlusOutlined /> 新建任务列表
                    </span>
                </Popover>
            </div>
        </div>
    );
};

export default CreateTaskList;
