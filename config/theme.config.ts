import { defineConfig } from 'umi';
import { prefixCls } from './_vars';

export default defineConfig({
    theme: {
        '@ant-prefix': prefixCls, // 主题若想生效，需要在config.ts中配置antd: { config: { prefixCls } }
        '@root-entry-name': 'default', // antd 17 引入了动态主题，https://ant.design/docs/react/customize-theme-variable-cn#%E7%9B%B8%E5%85%B3%E5%8F%98%E6%9B%B4
        // '@primary-color': '#1DA57A', //设置主题色
    },
});
