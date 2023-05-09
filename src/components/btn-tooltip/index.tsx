import React from 'react';
import { Tooltip, Button } from 'antd';
import styles from './index.less';

const BtnTooltip = ({
    tooltipContent = '',
    icon,
    size = 'mini',
    btnClass = '',
    circle = true,
    disabled = false,
    btnStyle = '',
    onClick = () => {},
    children,
}) => {
    return (
        <Tooltip
            className={styles['btn-tooltip']}
            title={tooltipContent}
            placement="top"
            mouseEnterDelay={0.3}
        >
            <Button
                icon={icon}
                className={btnClass}
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
