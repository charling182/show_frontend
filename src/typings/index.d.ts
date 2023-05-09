import React from 'react';
import { user } from './user';
import { department } from './department';
import { role } from './department';
import type { ErrorShowType } from 'umi';
declare global {
    namespace types {
        export type IRoute = {
            path?: string;
            exact?: boolean;
            redirect?: string;
            component?: React.ReactElement;
            routes?: IRoute[];
            key?: any;
            strict?: boolean;
            sensitive?: boolean;
            wrappers?: any[];
            unaccessible?: boolean;
            [k: string]: any;
        };
        export { user };
        export { department };
        export { role };

        export interface ErrorInfoStructure {
            /**
             * if request is success
             *
             * @type {boolean}
             * @memberof ErrorInfoStructure
             */
            success: boolean;
            /**
             * response data
             *
             * @type {*}
             * @memberof ErrorInfoStructure
             */
            data?: any;
            /**
             * code for errorType
             *
             * @type {string}
             * @memberof ErrorInfoStructure
             */
            errorCode?: string;
            /**
             * message display to user
             *
             * @type {string}
             * @memberof ErrorInfoStructure
             */
            errorMessage?: string;
            /**
             * error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 redirect to exception page
             *
             * @type {number}
             * @memberof ErrorInfoStructure
             */
            showType?: ErrorShowType;
            /**
             * Convenient for back-end Troubleshooting: unique request ID
             *
             * @type {string}
             * @memberof ErrorInfoStructure
             */
            traceId?: string;
            /**
             * Convenient for backend Troubleshooting: host of current access server
             *
             * @type {string}
             * @memberof ErrorInfoStructure
             */
            host?: string;
        }
        export type IConventionRouting = {
            menu?: {
                name?: string; // 菜单key，注意唯一性，会自动从语言文件中查找 menu.[key] 作为菜单显示名称
                icon?: string; // 菜单图标，支持@ant-design/icons中的所有图标
                hideChildren?: boolean; // 在菜单中隐藏他的子项，只展示自己
                flatMenu?: boolean; // 在菜单中只隐藏此项，子项往上提，仍旧展示
            };
            order?: number;
            layout?: {
                hideMenu?: boolean; // 自动隐藏页面菜单栏
                hideNav?: boolean; // 自动隐藏页面顶部导航条
                hideFooter?: boolean; // 自动隐藏页面底部footer
                // 如果把三个都设置为true，可以实现“无布局”效果，在实现login等全屏页面时非常有用
            };
            access?: string;
        };
    }
}
