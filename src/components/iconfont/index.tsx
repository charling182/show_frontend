import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import type { IconFontProps } from '@ant-design/icons/lib/components/IconFont';

const AntdIconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4040998_au4o2haqb6o.js',
});

type UdeskIconFontProps = {
    iconSize?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
};
const IconFont: React.FC<IconFontProps & UdeskIconFontProps> = (props) => {
    const { iconSize, ...pureProps } = props;

    return (
        <AntdIconFont
            {...pureProps}
            className={`charling-icon-font ${iconSize || 'md'} ${props.className || ''}`}
            type={`charling-icon-${props.type || ''}`}
        />
    );
};
export { IconFont };
