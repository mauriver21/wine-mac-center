import { useState } from 'react';
import { Button, ButtonProps, CircularProgress, Icon } from 'reactjs-ui-core';
import { InstallIcon } from '@assets/icons';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useNavigate } from 'react-router-dom';

export interface InstallAppButtonProps extends ButtonProps {
  appConfigId?: string;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  appConfigId,
  onClick: onClickProp,
  ...rest
}) => {
  const wineAppConfigModel = useWineAppConfigModel();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onClick: InstallAppButtonProps['onClick'] = async (event) => {
    setLoading(true);
    await wineAppConfigModel.read(appConfigId);
    onClickProp?.(event);
    setLoading(false);
    navigate(`/app-pipeline?appConfigId=${appConfigId}`);
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
