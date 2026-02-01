import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import { TooltipProps, withTooltip } from 'reactjs-shared-ui';

export type IconButtonProps = MuiIconButtonProps & TooltipProps;

export const IconButton: React.FC<IconButtonProps> = withTooltip(({ title: _, ...rest }) => {
  return <MuiIconButton {...rest} />;
});
