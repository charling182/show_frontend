import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
// import Cropper from '@/components/Cropper';
// import { useAppSelector } from '@/hooks';
// import { editUser, UserPermissions } from '@/api/user';
// import { validatePhone } from '@/utils/validate-rule-el-form';
import styles from './index.less';

const { Item } = Form;

const Test = () => {
  //   const [form] = Form.useForm();
  //   const [cropperVisible, setCropperVisible] = useState(false);
  //   const [avatar, setAvatar] = useState("");
  //   const [userInfo, setUserInfo] = useState({});
  //   const userInfo = useAppSelector((state) => state.user.userInfo);
  //   const userPermissions = UserPermissions;

  const onFinish = async (values: any) => {
    // try {
    //   await editUser(values);
    //   console.log("Success:", values);
    //   // 更新用户信息
    // } catch (error) {
    //   console.log("Error:", error);
    // }
  };

  const handleShowCropper = () => {
    // setCropperVisible(true);
  };

  const handleHideCropper = () => {
    // setCropperVisible(false);
  };

  const handleGetCropBlob = async (blob: any) => {
    handleHideCropper();

    // const formData = new FormData();
    // formData.append('file', blob, 'data.jpg');
    // const response = await upload(formData);
    // const path = response?.data?.path || "";
    // setAvatar(path);
  };

  return (
    <div>test子页面区</div>
    // <div className={styles["base-setting"]}>
    //   <div className={styles["wrap-form"]}>
    //     <Form
    //       name="ruleForm"
    //       form={form}
    //     //   initialValues={userInfo}
    //       onFinish={onFinish}
    //       labelCol={{ span: 6 }}
    //       wrapperCol={{ span: 12 }}
    //     >
    //       <Item label="用户名" name="username">
    //         <Input disabled />
    //       </Item>
    //       <Item label="昵称" name="nickname" rules={[{ required: true, message: "请输入昵称" }]}>
    //         <Input />
    //       </Item>
    //       <Item label="邮箱" name="email">
    //         <Input disabled />
    //       </Item>
    //       <Item
    //         label="手机号"
    //         name="phone"
    //         rules={[
    //             { required: true, message: '请输入手机号码' },
    //             { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确' },
    //           ]}
    //       >
    //         <Input />
    //       </Item>
    //       <Item label="公司" name="company">
    //         <Input />
    //       </Item>
    //       <Item label="城市" name="city">
    //         <Input />
    //       </Item>
    //       <Item wrapperCol={{ offset: 6, span: 12 }}>
    //         <Button
    //           type="primary"
    //           htmlType="submit"
    //         //   disabled={!userPermissions.doEdit}
    //         >
    //           保存
    //         </Button>
    //       </Item>
    //     </Form>
    //   </div>
    //   <div className={styles["wrap-photo"]} onClick={handleShowCropper}>
    //     <img src={avatar || userInfo?.avatar} alt="" />
    //     {/* <i className={styles[]}"el-icon-plus wrap-photo-plus"></i> */}
    //   </div>
    //   {/* <Cropper
    //     dialogTitle="修改头像"
    //     visible={cropperVisible}
    //     onClose={handleHideCropper}
    //     getCropBlob={handleGetCropBlob}
    //   /> */}
    // </div>
  );
};
// Test.menu = {
//   name: 'test子菜单',
//   // icon: 'QrcodeOutlined',
// };
export default Test;
