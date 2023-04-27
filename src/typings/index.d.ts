import React from 'react';
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
  }
}
