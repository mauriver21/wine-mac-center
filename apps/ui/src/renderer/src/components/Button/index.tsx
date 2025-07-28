import React from 'react';
import { Button as BaseButton, ButtonProps as BaseButtonProps } from 'reactjs-ui-core';

export interface ButtonProps extends BaseButtonProps {}

export const Button: React.FC<ButtonProps> = ({ sx, ...rest }) => {
  return (
    <BaseButton
      sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}`, ...sx }}
      color="secondary"
      {...rest}
    />
  );
};
