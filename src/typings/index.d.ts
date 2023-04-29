import React from 'react';
import { user } from './user';
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
  }
}
