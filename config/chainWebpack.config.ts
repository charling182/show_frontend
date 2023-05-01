// @ts-ignore
// import getSymlinks from 'get-symlinks';
import * as fs from 'fs';
import { defineConfig } from 'umi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
export default defineConfig({
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
              minimize: true,
              splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                automaticNameDelimiter: '.',
                cacheGroups: {
                  charlingantdesigns: {
                    name: 'antdesign',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](@ant-design)/,
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
