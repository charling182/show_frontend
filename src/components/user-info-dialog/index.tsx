import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import BImage from '@/components/b-image';
// import { getOne } from '@/api/user';
import styles from './index.less';

const UserInfoDialog = ({ userId }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (visible) {
      //   getOne({ id: userId }).then(({ data }) => setUser(data)).finally(() => setLoading(false));
    }
  }, [userId, visible]);

  const handleClose = () => setVisible(false);

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
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
            <i className="iconfont icon-suitcase" /> 工作信息
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
