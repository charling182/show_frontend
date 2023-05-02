import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin } from 'antd';
import styles from './index.less';
import { getUserList } from '@/api';

const MyComponent = (props) => {
  const {
    isDepartment,
    departmentData,
    memberData,
    onLoading,
    departmentOperationBtns,
    userListParams,
  } = props;
  const [userData, setUserData] = useState<types.user.userListParams[]>([]);

  const departmentOperationBtnClick = (index) => {
    // ...
  };

  const usernameClick = (item) => {
    // ...
  };

  const forbiddenUser = (item) => {
    // ...
  };

  const enableUser = (item) => {
    // ...
  };

  const removeUserFromDepartment = (item) => {
    // ...
  };
  // 获取用户列表数据
  const handelGetUserList = async () => {
    const result = await getUserList(userListParams);
    if (result.code === 200) {
      setUserData(result.data.rows);
    }
  };

  useEffect(() => {
    handelGetUserList();
  }, [userListParams]);

  return (
    <div className={styles['user-content']}>
      <div className={styles['wrap-content-head']}>
        <div className="title-content">
          {isDepartment ? departmentData.name : memberData.title}.
          {userData && userData.length}
        </div>
        {isDepartment && (
          <div className="wrap-ctrl">
            {/* {departmentOperationBtns.map((item, index) => (
                    <Button
                        key={index}
                        type="text"
                        disabled={item.disabled}
                        onClick={() => departmentOperationBtnClick(index)}
                    >
                        <i className={`iconfont ${item.icon}`} />
                        {item.label}
                    </Button>
                    ))} */}
          </div>
        )}
        <div className="wrap-list">
          <Spin spinning={onLoading}>
            {userData.map((item, index) => (
              <div key={index} className="wrap-list-item">
                <img className="user-avatar" src={item.avatar} alt="" />
                <div className="user-info">
                  <div
                    className="user-name"
                    onClick={() => usernameClick(item)}
                  >
                    {item.username}
                  </div>
                  <div className="foot color-light">
                    <div className="user-emial">{item.email}</div>
                    <div className="user-deportment">
                      {item.department && item.department.name}
                    </div>
                  </div>
                </div>
                {isDepartment && (
                  <div className="wrap-ctrl color-light">
                    {item.state === 1 ? (
                      <Popconfirm
                        title="确定禁用此用户吗？"
                        onConfirm={() => forbiddenUser(item)}
                      >
                        {/* <BtnTooltip
                                disabled={!$checkPermission(userPermissions.doEdit)}
                                icon="iconfont icon-icon-test"
                                tooltipContent="禁用"
                                /> */}
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title="确定启用此用户吗？"
                        onConfirm={() => enableUser(item)}
                      >
                        {/* <BtnTooltip
                                disabled={!$checkPermission(userPermissions.doEdit)}
                                icon="iconfont icon-qiyong"
                                tooltipContent="启用"
                                /> */}
                      </Popconfirm>
                    )}
                    <span className="line"></span>
                    <Popconfirm
                      title="确定移除此用户吗？"
                      onConfirm={() => removeUserFromDepartment(item)}
                    >
                      {/* <BtnTooltip
                                disabled={!$checkPermission(userPermissions.updateUserDepartment)}
                                icon="iconfont icon-ren-jianshao"
                                tooltipContent="移除"
                            /> */}
                    </Popconfirm>
                  </div>
                )}
              </div>
            ))}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
