import React, { useState, useRef, useEffect } from 'react';
import { IRouteComponentProps } from 'umi';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import ShapeShifter from '@/components/shape_shifter';
import { title } from '~/config/_vars';
import qs from 'qs';
import LoginForm from './components/login-form';
import RegisterForm from './components/register-form';
import RetrievePasswordForm from './components/retrieve-password-form';
import { When, Otherwise, Choose } from 'tsx-control-statements/components';
import { getTestData } from '@/api';

interface FormValues {
  username: string;
  password: string;
  remember: boolean;
}

const getLogoTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};
const Login = (props: IRouteComponentProps) => {
  const [status, setStatus] = useState<
    'login' | 'register' | 'retrievePassword'
  >('login');
  const [remember, setRemember] = useState<boolean>(false);
  const [logoTitle, setLogoTitle] = useState<string>(getLogoTitle(title));
  const [simulateArr, setSimulateArr] = useState<string[]>([
    '#icon charling',
    getLogoTitle(title),
    '',
  ]);
  const shapeShifterRef = useRef<any>(null);
  const [timerInter, setTimerInter] = useState<any>(null);
  const simulateIndexRef = useRef(0);

  const clickHandler = () => {
    if (shapeShifterRef.current) {
      shapeShifterRef.current.simulate(simulateArr[simulateIndexRef.current]);
      simulateIndexRef.current = (simulateIndexRef.current + 1) % 3;
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
    getTestData().then((res) => {
      console.log('getTestData', res);
    });
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
    <div className={styles['login-container']}>
      <ShapeShifter ref={shapeShifterRef} />
      <div className={styles['content']}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={16} xl={16}>
            <div style={{ color: 'transparent' }}>占位符</div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Choose>
              <When condition={status === 'login'}>
                <LoginForm setStatus={setStatus} />
              </When>
              <When condition={status === 'register'}>
                <RegisterForm setStatus={setStatus} />
              </When>
              <Otherwise>
                <RetrievePasswordForm setStatus={setStatus} />
              </Otherwise>
            </Choose>
          </Col>
        </Row>
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
