// tlm.config.js
//  @qiniu/typed-less-modules提供tlm命令,为less文件生成ts类型声明文件
const path = require('path');

module.exports = {
    pattern: './src/**/*.less',
    watch: true,
    exportType: 'default',
    nameFormat: 'none',
    logLevel: 'error',
    // 上述所有配置均可用
    aliases: {
        // 映射至多路径
        '~': path.resolve(__dirname, 'node_modules'),
        // 映射至单路径
        '~@': path.resolve(__dirname, 'src'),
        // 自定义映射规则
        // 'abc-module'(filePath) {
        //     return filePath.replace('abc-module', 'xxx-path');
        // },
    },
    // less.render options 参数
    lessRenderOptions: {
        javascriptEnabled: true,
        modifyVars: {
            '@ant-prefix': 'charling',
        },
    },
};
