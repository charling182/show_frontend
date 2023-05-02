import React from 'react';
import { Tooltip, Button } from 'antd';

const BtnTooltip = ({
  tooltipContent = '',
  icon = '',
  size = 'mini',
  btnClass = '',
  type = '',
  circle = true,
  disabled = false,
  btnStyle = '',
  onClick = () => {},
  children,
}) => {
  return (
    <Tooltip
      className="btn-tooltip"
      title={tooltipContent}
      placement="top"
      mouseEnterDelay={0.3}
    >
      <Button
        icon={icon}
        size={size}
        className={btnClass}
        shape={circle ? 'circle' : 'default'}
        disabled={disabled}
        type={type}
        style={btnStyle}
        onClick={onClick}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default BtnTooltip;
