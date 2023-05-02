import { useState, useEffect } from 'react';
import { Modal, Input, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getList, updateUserDepartment } from '@/api/user';
import { checkPermission } from '@/utils';
import BImage from '@/components/B-image';
import styles from './AddMemberToDepartmentDialog.module.scss';

const { Item: FormItem } = Modal;

const AddMemberToDepartmentDialog = ({ departmentData }) => {
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [userData, setUserData] = useState({ rows: [], count: 0 });
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(6);

  const getUserList = async () => {
    const { data } = await getList({
      keyword,
      limit: pageSize,
      department_id: 0,
      offset: (pageNo - 1) * pageSize,
    });
    setUserData(data);
  };

  useEffect(() => {
    getUserList();
  }, [visible]);

  const handleCurrentChange = (val) => {
    setPageNo(val);
    getUserList();
  };

  const addUserToDepartment = async (body) => {
    const { data } = await updateUserDepartment(body);
    console.log('addUserToDepartment data:', data);
    setPageNo(1);
    getUserList();
  };

  const addDepartment = (user) => {
    addUserToDepartment({
      id: user.id,
      department_id: departmentData.id,
    });
  };

  return (
    <div className={styles['add-member-to-department-dialog']}>
      <Modal
        title="添加成员至部门"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={400}
      >
        <div className={styles['wrap-content']}>
          <Input
            value={keyword}
            placeholder="请输入用户名或邮箱查找"
            prefix={<SearchOutlined />}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={getUserList}
            className={styles['search-input']}
          />
          <div className={styles['user-list']}>
            {userData.rows.map((item, index) => (
              <div key={index} className={styles['wrap-list-item']}>
                <BImage
                  className={styles['user-avatar']}
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
                  {departmentData.id !== item.department_id ? (
                    <Button
                      size="small"
                      type="text"
                      disabled={!checkPermission('updateUserDepartment')}
                      onClick={() => addDepartment(item)}
                    >
                      <i className="iconfont icon-jiaren"></i> 添加
                    </Button>
                  ) : (
                    <span>
                      <i
                        className="iconfont icon-ren"
                        style={{ marginRight: 5 }}
                      ></i>
                      已添加
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {userData.count > pageSize && (
            <div className="wrap-pagination">
              <Pagination
                current={pageNo}
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
    </div>
  );
};

export default AddMemberToDepartmentDialog;
