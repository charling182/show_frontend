import React from 'react';
import { DesktopOutlined } from '@ant-design/icons';

const Workbench = () => {
  return <div>Workbench</div>;
};
Workbench.menu = {
  name: '工作台',
  icon: 'DesktopOutlined',
};
Workbench.layout = {
  // hideMenu: true, // 自动隐藏页面菜单栏
  // hideNav: true, // 自动隐藏页面顶部导航条
  // hideFooter: true, // 自动隐藏页面底部footer
  // 如果把三个都设置为true，可以实现“无布局”效果，在实现login等全屏页面时非常有用
};
Workbench.access = 'root:referralTraffic';
Workbench.access = 'root:referralTraffic';
Workbench.order = 1;
export default Workbench;
