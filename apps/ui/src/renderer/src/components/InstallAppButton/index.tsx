import { useState } from 'react';
import { Button, ButtonProps, CircularProgress, Icon } from 'reactjs-shared-ui';
import { InstallIcon } from '@assets/icons';
// import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineAppsListContext } from '@hooks/useWineAppsListContext';
import { RootState } from '@interfaces/RootState';
import { useSelector } from 'react-redux';
import { ConfigOrigin } from '@constants/enums';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';

export interface InstallAppButtonProps extends ButtonProps {
  appName?: string;
  origin?: ConfigOrigin;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  appName,
  onClick: onClickProp,
  ...rest
}) => {
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName)
  );
  // const wineAppConfigModel = useWineAppConfigModel();
  const [loading, setLoading] = useState(false);
  const { setShowDialog, setAppName } = useWineAppsListContext() || {};

  const onClick: InstallAppButtonProps['onClick'] = async (event) => {
    setLoading(true);
    // await wineAppConfigModel.read('');
    onClickProp?.(event);
    setLoading(false);
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
      disabled={loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Icon size={24} color="text.primary" strokeWidth={2} render={InstallIcon} />
      )}
    </Button>
  );
};
