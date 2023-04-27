import type { FC } from 'react';
import React, { useCallback, useEffect } from 'react';
import nprogress from 'nprogress';
import debounce from 'lodash-es/debounce';
import ReactPlaceholder from 'react-placeholder';
import styles from './index.less';

/**
 * 启动Loading条的延迟时间，适当增大延迟时间可以避免进度条出现闪烁的情况
 */
const startLoadingDelay = process.env.NODE_ENV === 'development' ? 200 : 500;
/**
 * 结束Loading调的延迟时间。
 * 在开发模式下，切换页面路由会一次性动态加载多个文件，这样就会导致
 * 进度条被频繁结束-启动，从而出现进度条闪烁的情况。
 * 适当增大结束延迟时间，可以在加载第二、三个文件时，自动延长loading结束的时间，
 * 从而只会有一次结束，避免闪烁。
 */
const endLoadingDelay = process.env.NODE_ENV === 'development' ? 1000 : 500;
/**
 * placeholder的延迟启动时间。如果网络很快，延迟显示placeholder会避免出现闪烁的情况
 */
const placeholderAnimationDelay =
  process.env.NODE_ENV === 'development' ? 300 : 500;

let lastStart = 0;
const globalStart = debounce(() => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

  lastStart = Date.now();
  if (nprogress && !nprogress.isStarted()) {
    console.log('globalStart');
    nprogress.start();
  }
}, startLoadingDelay);
let lastDone = 0;
const globalDone = debounce(() => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  lastDone = Date.now();
  if (nprogress) {
    nprogress.done();
    console.log('globalDone');
  }
}, endLoadingDelay);

type ErrorLoadingProps = {
  isLoading?: boolean;
  pastDelay?: boolean;
  timedOut?: boolean;
  retry?: () => {};
  error?: Error;
};
const PageLoading: FC<ErrorLoadingProps> = (props) => {
  const done = useCallback(() => {
    // 如果有pending的动作，先取消掉
    globalStart.cancel();
    // 进度条完成
    globalDone();
  }, []);

  useEffect(() => {
    // 显示loading条
    globalStart();
    return () => {
      done();
    };
  }, [done]);

  if (process.env.NODE_ENV === 'development' && props.error) {
    // 显示加载模块过程中抛出的错误，注意不是实例化阶段的错误。
    // 实例渲染阶段的错误由ErrorBoundary统一拦截处理
    // eslint-disable-next-line no-console
    console.error(props.error.stack);
    // 出错了，也完成进度条
    done();
    return (
      <p className={styles['error-container']}>
        <strong>{props.error.message}</strong>
        <br />
        {props.error.stack}
      </p>
    );
  } else {
    return (
      <div
        className={styles['placeholder-container']}
        style={{
          animationName: styles['placeholder-delay'],
          animationDelay: `${placeholderAnimationDelay}ms`,
        }}
      >
        {/* ReactPlaceholder的media模式，默认样式和antd的Skeleton差不多，真的很像,但是可以自定义 */}
        <ReactPlaceholder
          type="text"
          showLoadingAnimation
          rows={10}
          ready={false}
        >
          <>{/* 占位符，因为placeholder要求必须有children */}</>
        </ReactPlaceholder>
      </div>
    );
  }
};

export default PageLoading;
