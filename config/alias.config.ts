import path, { dirname } from 'path';
import { defineConfig } from 'umi';

export default defineConfig({
    alias: {
        // 不要为react-router和react-router-dom设置别名，
        // 这两个路由库的版本有umi底层锁定，随着umi升级
        '~': path.resolve('./'),
    },
});
