import { defineConfig } from 'umi';

const proxyObj = {
    target: 'http://192.168.2.114:7001',
    // target: 'http://192.168.110.166:8001',
    // target: 'http://172.16.211.61:8001/', // 联调后端本地 ip地址+端口
    // pathRewrite: { '^/backend': '' }, // 联调后端本地 请求去掉backend
    // secure: false,
    changeOrigin: true,
    ws: true,
    followRedirects: true,
};

export default defineConfig({
    // https://github.com/chimurai/http-proxy-middleware#options
    proxy: {
        '/backend/': proxyObj,
        '/public/': proxyObj, // /public是后端生成的上传图片地址,开启代理之后本地就能访问后端的静态资源
    },
});
