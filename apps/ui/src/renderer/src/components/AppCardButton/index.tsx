import React from 'react';
import { Button, ButtonProps, Icon, IconProps } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface AppCardButtonProps extends ButtonProps {
  icon: React.FC;
  iconProps?: Omit<IconProps, 'render'>;
}

export const AppCardButton: React.FC<AppCardButtonProps> = ({ icon, iconProps, ...rest }) => {
  const { t } = useI18n();
  return (
    <Button
      sx={{ borderRadius: 2 }}
      equalSize={34}
      disableElevation={false}
      color="secondary"
      title={t('revealInFinder')}
      {...rest}
    >
      <Icon size={20} color="text.secondary" render={icon} {...iconProps} />
    </Button>
  );
};
