import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import { WithTooltipProps, withTooltip } from 'reactjs-shared-ui';

export type IconButtonProps = MuiIconButtonProps & WithTooltipProps;

export const IconButton: React.FC<IconButtonProps> = withTooltip(({ title: _, fullWidth: __, ...rest }) => {
  return <MuiIconButton {...rest} />;
});
