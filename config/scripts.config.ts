import { defineConfig } from 'umi';
// import { publicPath } from './_vars';

export default defineConfig({
    // 设置哪些模块可以不被打包，通过 <script> 或其他方式引入，通常需要和 scripts 或 headScripts 配置同时使用。
    // 简单理解的话，可以理解为 import nprogress from 'nprogress' 会被替换为 const nprogress = window.nprogress
    externals: {
        nprogress: 'window.nprogress',
        pdfjsLib: 'window.pdfjsLib',
        UE: 'window.UE',
    },
    headScripts: [{ src: `/static/js/nprogress.umd-0.2.0.js` }],
    // headScripts: [{ src: `${publicPath}static/js/nprogress.umd-0.2.0.js` }],
    scripts: [
        // { src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js' },
        // { src: 'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js' },
        // { src: `${publicPath}static/vendor/pdfjs/build/pdf.js` },
        // { src: `${publicPath}static/js/wwLogin-1.0.0.js`, async: true },
        // { src: `${publicPath}static/js/moment.js`, async: true }, //全局引入moment 用于ccps SDK
        // { src: `${publicPath}static/js/jquery-2.1.4.min.js`, async: true, defer: true },
        // { src: `${publicPath}static/vendor/ueditor/ueditor.config.js` },
        // { src: `${publicPath}static/vendor/ueditor/ueditor.all.min.js` },
        // {
        //     src: `${publicPath}static/vendor/ueditor/third-party/zeroclipboard/ZeroClipboard.min.js`,
        // },
        // {
        //     content: `
        //     pdfjsLib.GlobalWorkerOptions.workerSrc = '${publicPath}static/vendor/pdfjs/build/pdf.worker.js';
        //     `,
        // },
        // { src: `${publicPath}static/js/eruda-2.4.1.js` }, // 手机端调试工具
        // {
        //     content: `
        //     eruda.init();
        //         `,
        // },
    ],
});
