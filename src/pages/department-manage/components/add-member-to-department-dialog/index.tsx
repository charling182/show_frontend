import { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, Pagination } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { getUserList, updateUserDepartment } from '@/api';
import { message } from 'antd';
import BImage from '@/components/b-image';
import styles from './index.less';

const AddMemberToDepartmentDialog = ({
    departmentData,
    visible,
    setVisible,
    onAddMemberToDepartmentSuccess,
}) => {
    const [keyword, setKeyword] = useState('');
    const [userData, setUserData] = useState({ rows: [], count: 0 });
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);

    const handleGetUserList = async (type?: string) => {
        const { data } = await getUserList({
            keyword: type === 'clear' ? '' : keyword,
            limit: pageSize,
            department_id: 0,
            offset: (pageNumber - 1) * pageSize,
        });
        setUserData(data);
    };

    useEffect(() => {
        handleGetUserList();
    }, [visible, pageNumber, pageSize]);

    const handelInputChange = (e: any) => {
        setKeyword(e.target.value);
        if (!e.target.value) {
            handleGetUserList('clear');
        }
    };

    const addUserToDepartment = async (body) => {
        const { code } = await updateUserDepartment(body);
        if (code === 200) {
            message.success('添加成功');
            // 如果现在就在第一页，那么直接刷新列表
            if (pageNumber === 1) {
                handleGetUserList();
            }
            setPageNumber(1);
            onAddMemberToDepartmentSuccess();
        }
    };

    const addDepartment = (user) => {
        addUserToDepartment({
            id: user.id,
            department_id: departmentData.id,
        });
    };

    const handlePageChange = (val) => {
        setPageNumber(val);
    };

    return (
        <Modal
            title="添加成员至部门"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            width={400}
        >
            <div className={styles['wrap-content']}>
                <Input
                    value={keyword}
                    placeholder="请输入用户名或邮箱查找"
                    prefix={<SearchOutlined />}
                    onChange={handelInputChange}
                    onPressEnter={handleGetUserList}
                    className={styles['search-input']}
                />
                <div className={styles['user-list']}>
                    {userData.rows.map((item, index) => (
                        <div key={index} className={styles['wrap-list-item']}>
                            <BImage
                                src={item.avatar || ''}
                                width={32}
                                height={32}
                                borderRadius={32}
                            />
                            <div className={styles['user-info']}>
                                <div className={styles['user-name']}>{item.username}</div>
                                <div className={styles['foot']}>
                                    <div className={styles['user-emial']}>{item.email}</div>
                                </div>
                            </div>
                            <div className={styles['wrap-ctrl']}>
                                {departmentData && departmentData.id !== item.department_id ? (
                                    <Button
                                        icon={<UserAddOutlined />}
                                        onClick={() => addDepartment(item)}
                                    >
                                        添加
                                    </Button>
                                ) : (
                                    <span>已添加</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {userData.count > pageSize && (
                    <div className={styles['wrap-pagination']}>
                        <Pagination
                            size="small"
                            current={pageNumber}
                            pageSize={pageSize}
                            total={userData.count}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper={false}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddMemberToDepartmentDialog;
