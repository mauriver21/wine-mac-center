import { Button, ButtonProps, Icon } from 'reactjs-shared-ui';
import { InstallIcon } from '@assets/icons';
import { useWineAppsListContext } from '@hooks/useWineAppsListContext';
import { RootState } from '@interfaces/RootState';
import { useSelector } from 'react-redux';
import { ConfigOrigin } from '@constants/enums';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';

export interface InstallAppButtonProps extends ButtonProps {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  appName,
  origin,
  onClick: onClickProp,
  ...rest
}) => {
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, origin)
  );
  const { setShowDialog, setAppName } = useWineAppsListContext() || {};

  const onClick: InstallAppButtonProps['onClick'] = async (event) => {
    onClickProp?.(event);
    setShowDialog?.(true);
    setAppName?.(wineAppConfig?.name);
  };

  return (
    <Button
      disableElevation={false}
      sx={{ borderRadius: 2 }}
      title="Install App"
      equalSize={40}
      color="secondary"
      onClick={onClick}
      {...rest}
    >
      <Icon size={24} color="text.primary" strokeWidth={2} render={InstallIcon} />
    </Button>
  );
};
