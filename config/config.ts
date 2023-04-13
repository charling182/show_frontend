import { defineConfig } from 'umi';
import alias from './alias.config';

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
});

export default [
  defaultConfig,
  alias, // 配置别名，对引用路径进行映射。
].reduce(
  (previous, current) => ({ ...previous, ...current } as typeof defaultConfig),
  {},
);
