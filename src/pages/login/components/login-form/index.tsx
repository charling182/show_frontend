import React, { useState, Dispatch } from 'react';
import { Form, Input, Button, Checkbox, Space, message } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons';
import styles from './index.less';
import { title } from '~/config/_vars';
import { If } from 'tsx-control-statements/components';
import { login, getUserInfo } from '@/api';
import { history, useModel } from 'umi';
import {
  setJwtToLocalstorage,
  removeJwtFromLocalstorage,
  getJwtFromLocalstorage,
} from '@/utils';

interface FormValues {
  username: string;
  password: string;
}

interface LoginFormProps {
  setStatus: Dispatch<
    React.SetStateAction<'login' | 'register' | 'retrievePassword'>
  >;
}

const LoginForm = (props: LoginFormProps) => {
  const { setInitialState } = useModel('@@initialState');
  const { setStatus } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const logoTitle: string = title.charAt(0).toUpperCase() + title.slice(1);
  const onFinish = async (values: FormValues) => {
    try {
      const res = await login(values);
      if (res.code === 200) {
        if (getJwtFromLocalstorage()) {
          removeJwtFromLocalstorage();
        }
        // 设置初始化数据
        setJwtToLocalstorage(res.data.accessToken);
        const userInfo = await getUserInfo();
        if (userInfo.code === 200) {
          setInitialState({
            ...userInfo.data,
          });
        }
        message.success('登录成功');
        history.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form
      name="normal_login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      className={styles['login-form']}
    >
      <div className={styles['title']}>{logoTitle}</div>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名!', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            trigger: 'blur',
            message: '长度在 2 到 20 个字符',
          },
        ]}
      >
        <Input
          style={{ height: '40px' }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 20, message: '密码不得少于6位' },
        ]}
      >
        <Input.Password
          style={{ height: '40px' }}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>
      <div className={styles['wrap-login-btn']}>
        <Button
          loading={loading}
          className={styles['btn-special']}
          type="primary"
          htmlType="submit"
          block
        >
          登录
        </Button>
        <Button
          loading={loading}
          icon={<GithubOutlined />}
          className={`${styles['btn-special']} ${styles['github-button']}`}
          type="primary"
          htmlType="submit"
          block
        >
          github授权登录
        </Button>
      </div>
      <If condition={!loading}>
        <div
          onClick={() => setStatus('register')}
          className={styles['router-link-box']}
        >
          <span>注册</span>
        </div>
        <div
          onClick={() => setStatus('retrievePassword')}
          className={styles['router-link-box']}
        >
          <span>找回密码</span>
        </div>
      </If>
    </Form>
  );
};

export default LoginForm;
