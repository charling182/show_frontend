import React, { useState, Dispatch } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import styles from './index.less';

interface RegisterFormProps {
  setStatus: Dispatch<
    React.SetStateAction<'login' | 'register' | 'retrievePassword'>
  >;
}

const RegisterForm = (props: RegisterFormProps) => {
  const { setStatus } = props;
  const [count, setCount] = useState(60); // 倒计时秒数
  const [timing, setTiming] = useState(false); // 是否在倒计时中

  // 点击获取验证码
  const handleSendCode = () => {
    setTiming(true);
    message.success('验证码已发送，请注意查收');
    const timer = setInterval(() => {
      setCount((preSecond) => {
        if (preSecond <= 1) {
          setTiming(false);
          clearInterval(timer);
          return 60;
        }
        return preSecond - 1;
      });
    }, 1000);
  };

  return (
    <Form
      className={styles['register-form']}
      initialValues={{ remember: true }}
      onFinish={() => {}}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input
          style={{ height: '40px' }}
          prefix={<UserOutlined />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input
          style={{ height: '40px' }}
          prefix={<MailOutlined />}
          placeholder="邮箱"
        />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <Input
          style={{ height: '40px' }}
          prefix={<SafetyOutlined />}
          placeholder="验证码"
          suffix={
            <Button disabled={timing} onClick={handleSendCode}>
              {timing ? `${count}秒后重新获取` : '获取验证码'}
            </Button>
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能小于6位' },
        ]}
      >
        <Input.Password
          style={{ height: '40px' }}
          prefix={<LockOutlined />}
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password
          style={{ height: '40px' }}
          prefix={<LockOutlined />}
          placeholder="确认密码"
        />
      </Form.Item>
      <Form.Item>
        <Button
          style={{ height: '40px' }}
          type="primary"
          htmlType="submit"
          block
        >
          注册
        </Button>
      </Form.Item>
      <div
        onClick={() => setStatus('login')}
        className={styles['router-link-box']}
      >
        <span>登录</span>
      </div>
    </Form>
  );
};

export default RegisterForm;
