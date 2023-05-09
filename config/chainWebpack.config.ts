// @ts-ignore
// import getSymlinks from 'get-symlinks';
import * as fs from 'fs';
import { defineConfig } from 'umi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
export default defineConfig({
    // 代码会被分割为如下几个 chunk：'antdesign'、'antv'、'antd'、'rc'、'react'、'lodash'、'moment'、'vendors'、'udesk' 和 'umi'，它们会被分别打包成独立的文件。
    chunks:
        process.env.NODE_ENV === 'production'
            ? [
                  'antdesign',
                  'antd',
                  'rc',
                  'react',
                  'lodash',
                  // 'moment',
                  // 'vendors',
                  'umi',
                  'corejs',
                  'browserify-sign',
                  'elliptic',
              ]
            : undefined,
    chainWebpack:
        process.env.NODE_ENV === 'production'
            ? (config, { env, webpack, createCSSRule }) => {
                  config.plugin('clean').before('copy').use(new CleanWebpackPlugin({})); // 清除webpack输出目录下的历史文件
                  config.merge({
                      optimization: {
                          minimize: true, // 当将其设置为true时，webpack将尝试最小化输出文件的体积，此选项一般在生产环境中启用
                          splitChunks: {
                              chunks: 'async', // 配置告诉 webpack 只对动态代码（通过 import() 导入的模块）进行代码分割，而不是对所有模块都进行分割。这样可以避免把所有代码都打进同一个文件
                              minSize: 30000, // webpack 拆分的 chunk 的最小大小（以 bytes 为单位）,一般建议设置成适当的值来避免过多的网络请求
                              minChunks: 1,
                              automaticNameDelimiter: '.',
                              cacheGroups: {
                                  charlingantdesigns: {
                                      name: 'antdesign',
                                      chunks: 'all', // 配置意味着在模块的所有块中寻找共享模块，并提取到一个新的共享块中。
                                      test: /[\\/]node_modules[\\/](@ant-design)/, // 它匹配包含 "@ant-design" 的路径字符串，用于将这些路径下的模块打包到名为 "antdesign" 的 chunk 中
                                      priority: 10,
                                  },
                                  charlingantd: {
                                      name: 'antd',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/](antd)/,
                                      priority: 10,
                                  },
                                  charlingrc: {
                                      name: 'rc',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/](rc)/,
                                      priority: 10,
                                  },
                                  charlingreact: {
                                      name: 'react',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/](react|react-dom)/,
                                      priority: 10,
                                  },
                                  charlinglodash: {
                                      name: 'lodash',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/](lodash)/,
                                      priority: 10,
                                  },
                                  charlingcorejs: {
                                      name: 'corejs',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/]core-js[\\/]/,
                                      priority: 10,
                                  },
                                  browserifySign: {
                                      name: 'browserify-sign',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/]browserify-sign[\\/]/,
                                      priority: 10,
                                  },
                                  elliptic: {
                                      name: 'elliptic',
                                      chunks: 'all',
                                      test: /[\\/]node_modules[\\/]elliptic[\\/]/,
                                      priority: 10,
                                  },
                                  // charlingmoment: {
                                  //     name: 'moment',
                                  //     chunks: 'all',
                                  //     test: /[\\/]node_modules[\\/](moment)/,
                                  //     priority: 10,
                                  // },
                                  // charlingplugins: {
                                  //     name: 'vendors',
                                  //     chunks: 'all',
                                  //     test: /[\\/]node_modules[\\/](dva|redux|lazysizes)/,
                                  //     priority: 10,
                                  // },
                              },
                          },
                      },
                  });
                  // 强制打开sourcemap
                  // config.devtool('cheap-module-source-map');

                  // 将package.json中的本地软连接包添加到ts、jsx/js module规则中
                  // const symlinks = getSymlinks.sync(['./node_modules/**'], {
                  //     onlyDirectories: true,
                  //     deep: 1,
                  // });
                  // symlinks.forEach((linkPath: string) => {
                  //     const realPath = fs.realpathSync(linkPath);
                  //     config.module.rule('ts-in-node_modules').include.add(realPath);
                  //     config.module.rule('js-in-node_modules').include.add(realPath);
                  // });
              }
            : undefined,
});
