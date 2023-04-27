import React, { useState, useEffect } from 'react';
import { Button, Result } from 'antd';
import { useHistory } from 'react-router-dom';

const NotFoundPage = () => {
  const history = useHistory();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      history.push('/');
    }
  }, [countdown, history]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {countdown > 0 ? `返回首页(${countdown}s)` : '返回首页'}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
