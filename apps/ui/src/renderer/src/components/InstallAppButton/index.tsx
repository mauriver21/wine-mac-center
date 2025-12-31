import { Button, ButtonProps, Icon } from 'reactjs-shared-ui';
import { InstallIcon } from '@assets/icons';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { useNavigateApp } from '@hooks/useNavigateApp';

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
  const navigate = useNavigateApp();
  const wineAppPipelineModel = useWineAppPipelineModel();

  const runPipeline = async () => {
    const origin = ConfigOrigin.CLOUD;
    const config = await wineAppPipelineModel.scaffoldWineApp({ appName, origin });
    navigate.navigateToAppPipeline(config.name, {
      origin,
      action: PipelineAction.RUN
    });
  };

  const onClick: ButtonProps['onClick'] = (event) => {
    runPipeline();
    onClickProp?.(event);
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
