import React from 'react';
import { Button, ButtonProps, Icon, IconProps } from 'reactjs-shared-ui';

export interface AppCardButtonProps extends ButtonProps {
  icon: React.FC;
  iconProps?: Omit<IconProps, 'render'>;
}

export const AppCardButton: React.FC<AppCardButtonProps> = ({ icon, iconProps, ...rest }) => {
  return (
    <Button
      sx={{ borderRadius: 2 }}
      equalSize={34}
      disableElevation={false}
      color="secondary"
      title="Reveal in Finder"
      {...rest}
    >
      <Icon size={20} color="text.secondary" render={icon} {...iconProps} />
    </Button>
  );
};
