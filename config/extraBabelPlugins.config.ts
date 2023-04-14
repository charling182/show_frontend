import { defineConfig } from 'umi';

/**
 * 配置额外的 babel 插件。
 */
export default defineConfig({
  extraBabelPlugins: [
    'jsx-control-statements',
    // 'lodash',
    // 已经在 plugin-antd 中自动引入了
    // [
    //     'babel-plugin-import',
    //     {
    //         libraryName: 'udesk-ui',
    //         libraryDirectory: 'es',
    //         style: false,
    //     },
    // ],
  ],
});
