import React from 'react';
import { Popover } from 'antd';
import { logout } from '@/store/actions/user';
import styles from './index.less';
import { IconFont } from '@/components/iconfont';
import { history } from 'umi';
import { Modal, message } from 'antd';
import { getLogout } from '@/api';
import { removeJwtFromLocalstorage } from '@/utils';

const UserOperation = ({ children }) => {
  //   const dispatch = useDispatch();

  const handleGoToUserSetting = () => {
    history.push('/personal-center');
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '确认登出',
      content: '确认要退出登录吗？',
      onOk: async () => {
        const res = await getLogout();
        if (res.code === 200) {
          message.success('登出成功');
          removeJwtFromLocalstorage();
          history.push('/login');
        }
        // 在此处执行登出操作
      },
      onCancel() {
        message.info('已取消登出');
      },
    });
    // baseConfirm(`您确定要退出 ${title} 吗?`, null, async () => {
    //   await dispatch(logout());
    //   const fullPath = history.location.pathname;
    //   history.push(`/login?redirect=${fullPath}`);
    // });
  };

  return (
    <Popover
      placement="topLeft"
      trigger="hover"
      overlayClassName={`${styles['user-popover-component']}`}
      content={
        <div className={styles['user-popover']}>
          <div className={styles['options']}>
            <div className={styles['item']} onClick={handleGoToUserSetting}>
              <IconFont
                style={{ marginRight: '4px' }}
                iconSize="sm"
                type="people"
              />
              个人设置
            </div>
            <div className={styles['item']} onClick={handleLogout}>
              <IconFont
                className={styles['switch-button']}
                iconSize="sm"
                type="iconswitchbutton"
              />
              退出登录
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default UserOperation;
