import { Body1, Box, Card, CardProps, Icon, Image } from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@interfaces/RootState';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useEffect, useState } from 'react';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useNavigateApp } from '@hooks/useNavigateApp';
import {
  Cog6ToothIcon,
  ComputerDesktopIcon,
  PlayCircleIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import defaultArtwork from '@assets/imgs/header.jpg';
import { Cloud } from '@mui/icons-material';
import { useScriptsContext } from '@hooks/useScriptsContext';
import { AppCardButton } from '@components/AppCardButton';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { useAppModel } from '@models/useAppModel';

export interface AppCardProps extends CardProps {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}

export const AppCard: React.FC<AppCardProps> = ({ appName = '', origin, ...rest }) => {
  const scriptsContext = useScriptsContext();
  const { navigateToScript } = useNavigateApp();
  const appModel = useAppModel();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppPipelineModel = useWineAppPipelineModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, origin)
  );
  const navigate = useNavigateApp();
  const [artWorkSrc, setArtWorkSrc] = useState(defaultArtwork);
  const [noArtWork, setNoArtWork] = useState(true);

  const runPipeline = async () => {
    if (origin === undefined) {
      appModel.dispatchError('Origin is not defined');
    } else {
      const config = await wineAppPipelineModel.scaffoldWineApp({ appName, origin });
      navigate.navigateToAppPipeline(config.name, {
        origin,
        action: PipelineAction.RUN
      });
    }
  };

  useEffect(() => {
    if (wineAppConfig) {
      const artWorkSrc = wineAppConfig?.artworkURL || '';
      setArtWorkSrc(artWorkSrc || defaultArtwork);
      setNoArtWork(!Boolean(artWorkSrc));
    }
  }, [wineAppConfig?.artworkURL]);

  useEffect(() => {
    scriptsContext?.setAppName(appName);
  }, [appName]);

  return (
    <Card sx={{ width: 200, height: 300, borderRadius: 2 }} {...rest}>
      <Box
        height="100%"
        width="100%"
        p={1}
        display="grid"
        gridTemplateRows="230px 40px"
        rowGap={'10px'}
      >
        <Box position="relative">
          <Box
            position="absolute"
            top={-9}
            right={-9}
            width={30}
            height={30}
            borderRadius={2}
            bgcolor="secondary.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {origin === ConfigOrigin.CLOUD && (
              <Icon size={20} color="text.secondary" strokeWidth={2} render={Cloud} />
            )}
            {origin === ConfigOrigin.SCRIPTS && (
              <Icon size={20} color="text.secondary" strokeWidth={2} render={ComputerDesktopIcon} />
            )}
          </Box>
          <Image
            src={artWorkSrc}
            height="100%"
            width="100%"
            style={{
              objectFit: 'cover',
              maxWidth: '100%',
              borderRadius: 12
            }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {noArtWork ? (
              <Body1 textAlign="center" p={1} fontWeight={500}>
                {appName}
              </Body1>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Box display="flex" justifyContent="start" gap={1}>
          <AppCardButton title="Run Script" onClick={runPipeline} icon={PlayCircleIcon} />
          {origin === ConfigOrigin.SCRIPTS && (
            <>
              <AppCardButton
                title="Configure Script"
                onClick={() => navigateToScript(appName)}
                icon={Cog6ToothIcon}
              />
              {scriptsContext?.setOpenConfirmRemoveScript ? (
                <AppCardButton
                  title="Remove Script"
                  onClick={() => scriptsContext?.setOpenConfirmRemoveScript(true)}
                  icon={TrashIcon}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};
