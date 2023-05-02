import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
// import Cropper from '@/components/Cropper';
// import { useAppSelector } from '@/hooks';
// import { editUser, UserPermissions } from '@/api/user';
// import { validatePhone } from '@/utils/validate-rule-el-form';
import styles from './index.less';
import { history } from 'umi';
import { putChangeUserData } from '@/api';
import { useModel } from 'umi';

const { Item } = Form;

// 不可修改参数声明
interface IUserInfo {
  username: string;
  email: string;
}

const BaseSetting = (props) => {
  const { initialState }: any = useModel('@@initialState');
  const [form] = Form.useForm();
  const [cropperVisible, setCropperVisible] = useState(false);
  const [avatar, setAvatar] = useState('');
  // 这里使用了 TypeScript 的交叉类型（Intersection Type）特性
  const [userInfo, setUserInfo] = useState<
    types.user.changeUserData & IUserInfo
  >({
    username: initialState?.username || '',
    email: initialState?.email || '',
    id: initialState?.id || '',
    nickname: initialState?.nickname || '',
    phone: initialState?.phone || '',
    company: initialState?.company || '',
    city: initialState?.city || '',
  });
  const onFinish = async (values: any) => {
    console.log('person页面', values);

    //昵称是必填项
    if (!values.nickname) {
      message.warning('请输入昵称');
      return;
    }
    const { username, email, ...rest }: types.user.changeUserData & IUserInfo =
      values;
    const res = await putChangeUserData({
      ...rest,
      id: userInfo.id,
      nickname: '',
    });
    // const res = await putChangeUserData({ ...rest, id:userInfo.id});
    if (res.code === 200) {
      message.success('修改成功');
    }
  };

  const handleShowCropper = () => {
    // setCropperVisible(true);
  };

  const handleHideCropper = () => {
    // setCropperVisible(false);
  };

  const handleGetCropBlob = async (blob: any) => {
    handleHideCropper();
  };
  console.log('person页面6666', props.children);

  return (
    <div className={styles['personal-center']}>
      <div className={styles['base-setting']}>
        <div className={styles['wrap-form']}>
          <Form
            name="ruleForm"
            form={form}
            initialValues={userInfo}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
          >
            <Item label="用户名" name="username">
              <Input disabled />
            </Item>
            <Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input />
            </Item>
            <Item label="邮箱" name="email">
              <Input disabled />
            </Item>
            <Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确' },
              ]}
            >
              <Input />
            </Item>
            <Item label="公司" name="company">
              <Input />
            </Item>
            <Item label="城市" name="city">
              <Input />
            </Item>
            <Item wrapperCol={{ offset: 6, span: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                //   disabled={!userPermissions.doEdit}
              >
                保存
              </Button>
            </Item>
          </Form>
        </div>
        <div className={styles['wrap-photo']} onClick={handleShowCropper}>
          <img src={avatar || userInfo?.avatar} alt="" />
          {/* <i className={styles[]}"el-icon-plus wrap-photo-plus"></i> */}
        </div>
        {/* <Cropper
          dialogTitle="修改头像"
          visible={cropperVisible}
          onClose={handleHideCropper}
          getCropBlob={handleGetCropBlob}
        /> */}
      </div>
    </div>
  );
};
// BaseSetting.menu = {
//   name: '用户中心',
//   icon: 'AuditOutlined',
// };
// BaseSetting.layout = {
//     name: '个人中心',
//     icon: <CrownFilled />,
// }
// BaseSetting.icon = <CrownFilled />;
export default BaseSetting;
