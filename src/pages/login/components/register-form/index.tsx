import React, { useState, Dispatch } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import styles from './index.less';
import { sendVerificationCode, postRegister } from '@/api';

interface RegisterFormProps {
    setStatus: Dispatch<React.SetStateAction<'login' | 'register' | 'retrievePassword'>>;
}

const RegisterForm = (props: RegisterFormProps) => {
    const { setStatus } = props;
    const [count, setCount] = useState(60); // 倒计时秒数
    const [timing, setTiming] = useState(false); // 是否在倒计时中
    const [formValues, setFormValues] = useState<types.user.registerData | null>(null); // 保存表单数据的状态

    const onFormValuesChange = (changedValues: any, allValues: any) => {
        // 将表单数据保存到状态中
        setFormValues(allValues);
    };

    // 点击获取验证码
    const handleSendCode = async () => {
        try {
            // 判断邮箱是否填写,格式是否正确
            if (!formValues?.email) {
                message.error('请先填写邮箱');
                return;
            }
            if (!/^\w+@\w+(\.\w+)+$/.test(formValues.email)) {
                message.error('邮箱格式不正确');
                return;
            }
            const { code } = await sendVerificationCode({ target: formValues.email });
            if (code === 200) {
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
            } else {
                message.error('验证码发送失败，请稍后再试');
            }
        } catch (error) {
            message.error('验证码发送失败，请稍后再试');
        }
    };
    // 点击注册
    const onFinish = async (values: types.user.registerData) => {
        const { code } = await postRegister(values);
        if (code === 200) {
            message.success('注册成功');
            setStatus('login');
        }
    };

    return (
        <Form
            className={styles['register-form']}
            onValuesChange={onFormValuesChange} // 监听表单项值的变化
            onFinish={onFinish}
        >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input style={{ height: '40px' }} prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' },
                ]}
            >
                <Input style={{ height: '40px' }} prefix={<MailOutlined />} placeholder="邮箱" />
            </Form.Item>
            <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
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
                name="confirm_password"
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
                <Button style={{ height: '40px' }} type="primary" htmlType="submit" block>
                    注册
                </Button>
            </Form.Item>
            <div onClick={() => setStatus('login')} className={styles['router-link-box']}>
                <span>登录</span>
            </div>
        </Form>
    );
};

export default RegisterForm;
