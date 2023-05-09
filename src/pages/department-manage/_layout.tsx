import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserOutlined,
    UserDeleteOutlined,
    PartitionOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { getDepartmentList } from '@/api';
import UserContent from './components/user-content';
import Dayjs from 'dayjs';
import DepartmentOperation from './components/department-operation';

import styles from './index.less';

const memberBtns = [
    {
        title: '所有成员',
        icon: <TeamOutlined className={styles['item-member-icon']} />,
    },
    {
        title: '新加入成员',
        icon: <UserAddOutlined className={styles['item-member-icon']} />,
    },
    {
        title: '未分配部门的成员',
        icon: <UserOutlined className={styles['item-member-icon']} />,
    },
    {
        title: '停用的成员',
        icon: <UserDeleteOutlined className={styles['item-member-icon']} />,
    },
];

const DepartmentManagement = (props) => {
    const [departmentList, setDepartmentList] = useState<types.department.updateDepartmentParams[]>(
        []
    );
    const [memberSelectIndex, setMemberSelectIndex] = useState(1);
    const [memberKeyword, setMemberKeyword] = useState('');
    const [userListParams, setUserListParams] = useState<types.user.userListParams>();
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const onSearch = () => {
        // 处理搜索逻辑
        setUserListParams({ ...userListParams, keyword: memberKeyword });
    };

    const onMemberBtnClick = (index: number) => {
        setMemberKeyword('');
        index === 0 && setUserListParams({});
        index === 1 &&
            setUserListParams({
                date_after_created: Dayjs().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'),
            });
        index === 2 && setUserListParams({ department_id: 0 });
        index === 3 && setUserListParams({ status: 0 });
        setMemberSelectIndex(index);
    };

    const onAddDepartmentClick = () => {
        // 处理添加部门逻辑
        setVisible(true);
    };
    const memberSelectClick = (index: number, department_id: number) => {
        setUserListParams({ department_id });
        setMemberSelectIndex(index);
    };
    // 获取部门列表数据
    const handelGetDepartmentList = async () => {
        setLoading(true);
        const result = await getDepartmentList();
        if (result.code === 200) {
            setDepartmentList(result.data.rows);
        }
        setLoading(false);
    };
    const handleDepartmentSuccess = () => {
        setVisible(false);
        handelGetDepartmentList();
    };
    const handleDeleteDepartmentSuccess = () => {
        setMemberSelectIndex(memberBtns.length);
        setUserListParams({ department_id: departmentList[0].id });
        handelGetDepartmentList();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMemberKeyword(e.target.value);
        if (!e.target.value) {
            setUserListParams({ ...userListParams, keyword: '' });
        }
    };

    useEffect(() => {
        handelGetDepartmentList();
    }, []);

    return (
        <>{props.children}</>
        // <div className={styles['departmentManagement-container']}>
        //   <div className={styles['wrap-nav']}>
        //     <div>
        //       <Input
        //         value={memberKeyword}
        //         prefix={<SearchOutlined />}
        //         placeholder="输入'用户名/邮箱'回车搜索"
        //         style={{ width: 228 }}
        //         onPressEnter={onSearch}
        //         onChange={handleInputChange}
        //       />
        //     </div>
        //     <span className={styles['title-box']}>成员</span>
        //     <div className={styles['warp-member']}>
        //       {memberBtns.map((item, index) => (
        //         <div
        //           key={index}
        //           className={
        //             styles['item-member'] +
        //             ' ' +
        //             (memberSelectIndex === index
        //               ? styles['item-member-active']
        //               : '')
        //           }
        //           onClick={() => onMemberBtnClick(index)}
        //         >
        //           {item.icon}
        //           <span className={styles['title']}>{item.title}</span>
        //         </div>
        //       ))}
        //     </div>
        //     <span className={styles['title-box']}>
        //       部门
        //       <Button
        //         size="small"
        //         style={{ marginLeft: 110, fontSize: 14 }}
        //         type="link"
        //         icon={<PlusOutlined />}
        //         onClick={onAddDepartmentClick}
        //       >
        //         创建部门
        //       </Button>
        //     </span>
        //     <div className={styles['warp-menu']}>
        //       {departmentList.map((item, index) => (
        //         <div
        //           key={index}
        //           className={classnames(styles['item-member'], {
        //             [styles['item-member-active']]:
        //               memberSelectIndex === index + memberBtns.length,
        //           })}
        //           onClick={() =>
        //             memberSelectClick(index + memberBtns.length, item.id)
        //           }
        //         >
        //           <PartitionOutlined
        //             className={classnames(styles['item-member-icon'])}
        //           />
        //           <span className={styles['title']}>{item.name}</span>
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        //   <div className={styles['wrap-content']}>
        //     <UserContent
        //       userListParams={userListParams}
        //       isDepartment={memberSelectIndex > 3}
        //       departmentData={departmentList[memberSelectIndex - memberBtns.length]}
        //       memberData={memberBtns[memberSelectIndex]}
        //       memberKeyword={memberKeyword}
        //       loading={loading}
        //       handleDepartmentSuccess={handleDepartmentSuccess}
        //       handleDeleteDepartmentSuccess={handleDeleteDepartmentSuccess}
        //     />
        //   </div>
        //   <DepartmentOperation
        //     visible={visible}
        //     setVisible={setVisible}
        //     isCreateDepartment
        //     onDepartmentSuccess={handleDepartmentSuccess}
        //    />
        // </div>
    );
};

DepartmentManagement.menu = {
    name: '部门管理',
    icon: 'LayoutOutlined',
};

DepartmentManagement.order = 3;

export default DepartmentManagement;
