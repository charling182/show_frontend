import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import BImage from '@/components/b-image';
import { getUserInfoById } from '@/api';
import { ContactsOutlined } from '@ant-design/icons';

import styles from './index.less';

const UserInfoDialog = ({
    userId,
    visible,
    setVisible,
}: {
    userId: number;
    visible: boolean;
    setVisible: any;
}) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});

    const handleGetUserInfoById = async () => {
        const { data, code } = await getUserInfoById({ id: userId });
        if (code === 200) {
            setUser(data);
        }
    };

    useEffect(() => {
        if (visible) {
            handleGetUserInfoById();
        }
    }, [userId, visible]);

    const handleClose = () => setVisible(false);

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            className={styles['user-info-dialog']}
            title={<div className={styles['title-box']}>{user.username}详细信息</div>}
        >
            <div className={styles.content}>
                <div className={styles['wrap-user']}>
                    <BImage
                        className={styles['user-avatar']}
                        src={user.avatar || ''}
                        width={64}
                        height={64}
                        borderRadius={64}
                    />
                    <div className={styles.username}>{user.username}</div>
                </div>
                <div className={styles['wrap-info']}>
                    <div className={styles.tip}>
                        <ContactsOutlined className={styles['icon']} /> 工作信息
                        <div className={styles.line} />
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>昵称</div>
                        <div className={styles.value}>{user.nickname || '-'}</div>
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>职位</div>
                        <div className={styles.value}>{user.position || '-'}</div>
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>邮箱</div>
                        <div className={styles.value}>{user.email || '-'}</div>
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>手机</div>
                        <div className={styles.value}>{user.phone || '-'}</div>
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>部门</div>
                        <div className={styles.value}>
                            {(user.department && user.department.name) || '-'}
                        </div>
                    </div>
                    <div className={styles['item-info']}>
                        <div className={styles.title}>城市</div>
                        <div className={styles.value}>{user.city || '-'}</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UserInfoDialog;
