import React from 'react';
import { Popover } from 'antd';
// import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { logout } from '@/store/actions/user';
// import { baseConfirm } from '@/utils/dialog';
import styles from './index.less';
import { IconFont } from '@/components/iconfont';
import { history } from 'umi';

const UserOperation = ({ children }) => {
  //   const dispatch = useDispatch();

  const handleGoToUserSetting = () => {
    history.push('/personal-center');
  };

  const handleLogout = () => {
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
