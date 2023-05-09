import { defineConfig } from 'umi';
import alias from './alias.config';
import extraBabelPlugins from './extraBabelPlugins.config';
import proxy from './proxy.config';
import plugin from './plugin.config';
import theme from './theme.config';
import scripts from './scripts.config';
import chainWebpack from './chainWebpack.config';

/**
 * 项目输出路径。优先使用build项目路径，如果没有，则使用本项目的dist目录
 */
const OUTPUT_PATH = '../show_frontend_build/dist';

/**
 * umi的配置文件，详细文档参考这里：https://umijs.org/zh-CN/config
 *
 * 【关于配置项拆分】
 * umi文档上说支持子配置项拆分到独立的文件中去，但还目前没有实现。
 * https://github.com/umijs/umi/commit/63c08107baf3c17bb57fd12183bee3a62902cfa3
 * 所以先自己手动导入，等官方支持后再按照规则定义子文件
 */
const defaultConfig = defineConfig({
    // 配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存
    hash: true,
    // 指定输出路径
    outputPath: OUTPUT_PATH,
    // mfsu 是一种基于 webpack5 新特性 Module Federation 的打包提速方案   https://umijs.org/zh-CN/docs/mfsu
    mfsu: {},
    // webpack5 是一种基于 webpack5 新特性的打包提速方案   https://umijs.org/zh-CN/docs/webpack5
    webpack5: {},
    // 配置额外的 umi 插件
    dynamicImport: {
        loading: '@/components/page-loading/index',
    },
    // 配置额外的 link 标签
    links: [
        {
            rel: 'stylesheet',
            href: `/static/css/nprogress-0.2.0.css`,
        },
    ],
});

export default [
    defaultConfig,
    alias, // 配置别名，对引用路径进行映射。
    extraBabelPlugins, // 配置额外的 babel 插件。
    proxy, // 配置开发阶段的代理
    plugin, // 插件相关配置
    theme, // 配置主题，实际上是配 less 变量
    chainWebpack, // 修改 webpack 配置。
    scripts, // 配置静态脚本
].reduce((previous, current) => ({ ...previous, ...current } as typeof defaultConfig), {});
