import React from 'react';
import { Button, ButtonProps, Icon } from 'reactjs-shared-ui';

export interface AppCardButtonProps extends ButtonProps {
  icon: React.FC;
}

export const AppCardButton: React.FC<AppCardButtonProps> = ({ icon, ...rest }) => {
  return (
    <Button
      sx={{ borderRadius: 2 }}
      equalSize={40}
      disableElevation={false}
      color="secondary"
      title="Reveal in Finder"
      {...rest}
    >
      <Icon size={24} color="text.secondary" render={icon} />
    </Button>
  );
};
