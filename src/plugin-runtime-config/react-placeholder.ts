import ReactPlaceholder from 'react-placeholder';

// 全局设置placeholder的className，并在global.scss中增加了默认样式
ReactPlaceholder.defaultProps = {
    ...ReactPlaceholder.defaultProps,
    className: 'skeleton',
};
