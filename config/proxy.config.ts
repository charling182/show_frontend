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
        // 微信客服相关接口基地址与其他接口不同
        // '/agent/admin/': proxyObj,
        '/socket.io': proxyObj,
    },
});
