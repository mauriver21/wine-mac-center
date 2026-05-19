import { Body1, Box, Card, CardProps, Icon, Image } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@interfaces/RootState';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useEffect, useState } from 'react';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useNavigateApp } from '@hooks/useNavigateApp';
import {
  ArrowDownCircleIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  PlayCircleIcon
} from '@heroicons/react/24/solid';
import { Cloud } from '@mui/icons-material';
import { useScriptsContext } from '@hooks/useScriptsContext';
import { AppCardButton } from '@components/AppCardButton';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { ContextMenu } from '@components/ContextMenu';
import defaultArtwork from '@assets/imgs/header.jpg';

export interface AppCardProps extends CardProps {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}

export const AppCard: React.FC<AppCardProps> = ({ appName = '', origin, ...rest }) => {
  const { t } = useI18n();
  const scriptsContext = useScriptsContext();
  const { navigateToScript } = useNavigateApp();
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppPipelineModel = useWineAppPipelineModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, origin)
  );
  const isDownloadedScript = useSelector((state: RootState) =>
    wineAppConfigModel.selectIsDownloadedScript(state, appName)
  );
  const navigate = useNavigateApp();
  const [artWorkSrc, setArtWorkSrc] = useState(defaultArtwork);
  const [noArtWork, setNoArtWork] = useState(true);

  const runPipeline = async () => {
    await wineAppPipelineModel.scaffoldWineApp({ appName, origin }, (appName) => {
      navigate.navigateToAppPipeline(appName, {
        origin,
        action: PipelineAction.RUN
      });
    });
  };

  useEffect(() => {
    if (wineAppConfig) {
      const artWorkSrc = wineAppConfig?.artworkURL || '';
      setArtWorkSrc(artWorkSrc || defaultArtwork);
      setNoArtWork(!Boolean(artWorkSrc));
    }
  }, [wineAppConfig?.artworkURL]);

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
            onError={() => {
              setNoArtWork(true);
              setArtWorkSrc(defaultArtwork);
            }}
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
        <Box display="flex" justifyContent="end" alignItems="center" gap={1}>
          <AppCardButton title={t('runScript')} onClick={runPipeline} icon={PlayCircleIcon} />
          {origin === ConfigOrigin.CLOUD && !isDownloadedScript && (
            <AppCardButton
              title={t('downloadScript')}
              onClick={() => wineAppConfigModel.downloadScript(appName)}
              icon={ArrowDownCircleIcon}
            />
          )}
          {origin === ConfigOrigin.SCRIPTS && (
            <>
              <AppCardButton
                title={t('configureScript')}
                onClick={() => navigateToScript(appName)}
                icon={Cog6ToothIcon}
              />
              <ContextMenu
                menuItems={[
                  ...(origin === ConfigOrigin.SCRIPTS
                    ? [
                        {
                          label: 'Copy Script',
                          onClick: () => {
                            navigateToScript(appName, { copyScript: true });
                          }
                        },
                        {
                          label: 'Remove Script',
                          onClick: () => {
                            scriptsContext?.setAppName(appName);
                            scriptsContext?.setOpenConfirmRemoveScript(true);
                          }
                        }
                      ]
                    : [])
                ]}
              />
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};
