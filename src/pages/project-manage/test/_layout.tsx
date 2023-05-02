import React from 'react';

const Test = (props) => {
  return (
    <div>
      <h1>Test</h1>
      {props.children}
    </div>
  );
};

Test.menu = {
  name: '测试',
  icon: 'AuditOutlined',
};

export default Test;
