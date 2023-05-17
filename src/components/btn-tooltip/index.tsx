import React from 'react';
import { Tooltip, Button } from 'antd';
import styles from './index.less';

const BtnTooltip = ({
    tooltipContent = '',
    icon,
    size = 'mini',
    circle = true,
    disabled = false,
    onClick = () => {},
    children,
    btnStyle = {},
    type = '',
}) => {
    return (
        <Tooltip
            trigger={['hover']}
            className={styles['btn-tooltip']}
            title={tooltipContent}
            placement="top"
            mouseEnterDelay={0.3}
        >
            <Button
                style={btnStyle}
                icon={icon}
                size={size}
                type={type}
                shape={circle ? 'circle' : 'default'}
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </Button>
        </Tooltip>
    );
};

export default BtnTooltip;
