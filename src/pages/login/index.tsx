import React, { useState, useRef, useEffect } from 'react';
import { IRouteComponentProps } from 'umi';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import ShapeShifter from '@/components/shape_shifter';
import { title } from '~/config/_vars';
import qs from 'qs';

interface FormValues {
  username: string;
  password: string;
  remember: boolean;
}

const getLogoTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};
const Login = (props: IRouteComponentProps) => {
  const [remember, setRemember] = useState<boolean>(false);
  const [logoTitle, setLogoTitle] = useState<string>(getLogoTitle(title));
  // const [simulateArr, setSimulateArr] = useState<string[]>(['#icon logo',getLogoTitle(title),'']);
  const [simulateArr, setSimulateArr] = useState<string[]>([
    '#icon charling',
    getLogoTitle(title),
    '',
  ]);
  const shapeShifterRef = useRef<any>(null);
  const [timerInter, setTimerInter] = useState<any>(null);
  const simulateIndexRef = useRef(0);

  const onFinish = (values: FormValues) => {
    console.log('Received values of form: ', values);
  };
  const clickHandler = () => {
    if (shapeShifterRef.current) {
      shapeShifterRef.current.simulate(simulateArr[simulateIndexRef.current]);
      simulateIndexRef.current = (simulateIndexRef.current + 1) % 3;
      // console.log('simulateIndex',simulateIndex);

      // console.log('simulateIndex',simulateIndex,(simulateIndex + 1) % 3);
      // let nextIndex:number = (simulateIndex + 1) % 3;
      // setSimulateIndex(nextIndex % 3);
      // setSimulateIndex(prevState => {
      //     console.log('prevState',prevState);
      //     let nextIndex:number = (prevState + 1) % 3;
      //     return nextIndex;
      // });
    }
  };
  const clearTimer = () => {
    if (timerInter) {
      clearInterval(timerInter);
      setTimerInter(null);
    }
  };
  const initTimer = () => {
    clearTimer();
    setTimerInter(
      setInterval(() => {
        clickHandler();
      }, 1000 * 9),
    );
  };
  const doVisibilitychange = () => {
    // 页面变为不可见时触发
    if (document.visibilityState == 'hidden') {
      clearTimer();
    }
    // 页面变为可见时触发
    if (document.visibilityState == 'visible') {
      initTimer();
    }
  };

  useEffect(() => {
    // 如果路由中带有code参数则认为是github登录中，显示github Icon
    let { code } = qs.parse(window.location.search?.replace(/^\?/, ''));
    if (shapeShifterRef.current) {
      if (code) {
        shapeShifterRef.current.simulate('#icon github');
      } else {
        shapeShifterRef.current.simulate(simulateArr[simulateIndexRef.current]);
        simulateIndexRef.current = (simulateIndexRef.current + 1) % 3;
      }
      initTimer();
      // 当页面不可见时，清空定时器
      document.addEventListener('visibilitychange', doVisibilitychange);
    }
    return () => {
      clearTimer();
      document.removeEventListener('visibilitychange', doVisibilitychange);
    };
  }, []);

  return (
    <div>
      <ShapeShifter ref={shapeShifterRef} />
      <div style={{ width: 300, margin: 'auto', marginTop: 50 }}>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your Username!' },
              { type: 'email', message: 'Please input a valid email address!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox onChange={(e) => setRemember(e.target.checked)}>
                Remember me
              </Checkbox>
            </Form.Item>

            <a style={{ float: 'right' }} href="/">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
            Or <a href="/">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

// Login.menu = {
//     name: 'attract',
//     icon: 'QrcodeOutlined',
// };

// Login.order = 1;
// Login.access = 'root:referralTraffic';

export default Login;
