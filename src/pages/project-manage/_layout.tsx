import React from 'react';

const ProjectManage = (props) => {
  return <>{props.children}</>;
};

ProjectManage.menu = {
  name: '项目管理',
  icon: 'LineChartOutlined',
};

ProjectManage.order = 2;

export default ProjectManage;
