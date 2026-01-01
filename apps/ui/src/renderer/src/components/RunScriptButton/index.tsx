import { Button, ButtonProps, Icon } from 'reactjs-shared-ui';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

export interface RunScriptButtonProps extends ButtonProps {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}

export const RunScriptButton: React.FC<RunScriptButtonProps> = ({
  appName,
  origin = ConfigOrigin.SCRIPTS,
  onClick: onClickProp,
  ...rest
}) => {
  const navigate = useNavigateApp();
  const wineAppPipelineModel = useWineAppPipelineModel();

  const runPipeline = async () => {
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
      title="Run Script"
      equalSize={40}
      color="secondary"
      onClick={onClick}
      {...rest}
    >
      <Icon size={24} color="text.primary" strokeWidth={2} render={PlayCircleIcon} />
    </Button>
  );
};
