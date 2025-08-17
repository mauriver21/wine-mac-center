import { useState } from 'react';
import { Button, ButtonProps, CircularProgress, Icon } from 'reactjs-shared-ui';
import { InstallIcon } from '@assets/icons';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineAppsListContext } from '@hooks/useWineAppsListContext';
import { useWineAppModel } from '@models/useWineAppModel';
import { RootState } from '@interfaces/RootState';
import { useSelector } from 'react-redux';

export interface InstallAppButtonProps extends ButtonProps {
  appConfigId?: string;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  appConfigId,
  onClick: onClickProp,
  ...rest
}) => {
  const wineAppModel = useWineAppModel();
  const wineApp = useSelector((state: RootState) => wineAppModel.selectWineApp(state, appConfigId));
  const wineAppConfigModel = useWineAppConfigModel();
  const [loading, setLoading] = useState(false);
  const { setShowDialog, setAppName, setAppConfigId } = useWineAppsListContext() || {};

  const onClick: InstallAppButtonProps['onClick'] = async (event) => {
    setLoading(true);
    await wineAppConfigModel.read(appConfigId);
    onClickProp?.(event);
    setLoading(false);
    setShowDialog?.(true);
    setAppName?.(wineApp?.name);
    setAppConfigId?.(appConfigId);
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
