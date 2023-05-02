import { backendBase } from '@/api/index';
import { RequestConfig, ErrorShowType, history } from 'umi';
import Request, { RequestOptionsInit } from 'umi-request';
import { getJwtFromLocalstorage, removeJwtFromLocalstorage } from '@/utils';

type RequestOptionsExtra = {
  skipErrorHandler?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

const handleRequestInterceptors = (url: string, options: any) => {
  // 微信客服相关接口基地址与其他不同,故需要专门处理
  let handleUrl: string = url;
  const appToken = getJwtFromLocalstorage();
  // 将参数中非false，0 的非真参数去除
  const paramsArr = Reflect.ownKeys(options.params);
  paramsArr.forEach((key) => {
    if (
      options.params[key] !== false &&
      options.params[key] !== 0 &&
      !options.params[key]
    ) {
      Reflect.deleteProperty(options.params, key);
    }
  });
  const defaultErrorHandler = options.errorHandler;
  // eslint-disable-next-line no-param-reassign
  options.errorHandler = (error: any) => {
    console.log('error----------------', error);

    // 判断是否被cancel了。
    // 如果是，则构造一个info子对象，并把showType设置为silent，这样umi底层就不弹错误提示了
    // 支持使用umi的两种取消方式：CancelToken（已废弃）和AbortController（推荐）
    if (
      Request.isCancel(error) ||
      (error instanceof DOMException &&
        error.type === 'AbortError') /* && error.request?.options?.signal */
    ) {
      const errorInfo = {
        // 增加一个标识，请求是否被abort了？这个在业务系统里会用到
        isAborted: true,
        message: error.message || 'Request was aborted',
        errorMessage: error.message || 'Request was aborted',
        errorCode: 0,
        data: undefined,
        success: false,
        showType: ErrorShowType.SILENT,
      };
      // eslint-disable-next-line no-param-reassign
      error.info = errorInfo;
    }
    if (defaultErrorHandler) {
      defaultErrorHandler(error);
    }
    throw error;
  };
  // 如果有操作日志埋点在header中携带标识,就需要兼容一下appToken的情况
  let headers: any =
    options?.headers && Object.keys(options?.headers)
      ? { ...options?.headers }
      : {};
  if (appToken) {
    headers = {
      ...headers,
      Accept: 'application/json',
      Authorization: appToken,
    };
    if (options.requestType !== 'form') {
      headers['Content-Type'] = 'application/json';
    }
    return {
      url: handleUrl,
      options: { ...options, headers },
    };
  }
  return {
    url: handleUrl,
    options: { ...options },
  };
};

export const request: RequestConfig = {
  // 接口地址前缀，会拼接到 url 前面
  prefix: backendBase,
  timeout: 1000,
  // 当后端接口不满足该规范的时候你需要通过该配置把后端接口数据转换为该格式，该配置只是用于错误处理，不会影响最终传递给页面的数据格式。
  // 且会自行生成message提示框,所以不用专门在接口里面处理报错信息
  errorConfig: {
    adaptor: (
      resp,
      context: {
        req: {
          url: string;
          options: RequestOptionsInit & RequestOptionsExtra;
        };
        res: Response;
      },
    ): types.ErrorInfoStructure => {
      const errorInfo = {
        ...resp,
      };
      if (context.res instanceof Response) {
        // 非后端标准数据结构
        Object.assign(errorInfo, {
          success: context.res.ok,
          bizCode: errorInfo.bizCode || context.res.status?.toString(),
          errorCode: context.res.status?.toString(),
          errorMessage:
            errorInfo.msg ||
            context.req.options.errorMessage ||
            context.res.statusText,
          showType:
            context.res.status === 401
              ? ErrorShowType.SILENT
              : ErrorShowType.ERROR_MESSAGE,
        });
      }
      if (
        resp &&
        resp.code &&
        Object.prototype.hasOwnProperty.call(resp, 'visible')
      ) {
        // 后端标准数据结构
        Object.assign(errorInfo, {
          success: !!resp.succeed,
          bizCode: errorInfo.bizCode || resp.bizCode,
          // 不使用后端返回的code，因为不可靠。比如在登录时，返回的httpCode是401，但response.code是400
          // errorCode: resp.code,
          errorMessage: resp.visible ? resp.message : errorInfo.errorMessage,
        });
      }
      return errorInfo;
    },
  },
  middlewares: [],
  requestInterceptors: [handleRequestInterceptors],
  responseInterceptors: [
    (response, options: RequestOptionsInit & RequestOptionsExtra) => {
      // 如果是401且不是在登录页，则跳转到登录页
      if (response.status === 401 && history.location.pathname !== `/login`) {
        // if (getJwtFromLocalstorage()) {
        //   removeJwtFromLocalstorage();
        // }
        // history.push('/login');
      }
      if (response.ok && options.successMessage) {
        // message.success(options.successMessage);
      }
      return response;
    },
  ],
};
