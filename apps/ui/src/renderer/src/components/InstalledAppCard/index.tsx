import { Body1, Box, Button, Card, CardProps, Icon, Image } from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { RootState } from '@interfaces/RootState';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { getAppArtwork } from '@utils/getAppArtwork';
import { ConfigOrigin, PipelineAction, ProcessStatus } from '@constants/enums';
import { useNavigateApp } from '@hooks/useNavigateApp';
import defaultArtwork from '@assets/imgs/header.jpg';

export interface InstalledAppCardProps extends CardProps {
  appName?: string;
}

export const InstalledAppCard: React.FC<InstalledAppCardProps> = ({ appName, ...rest }) => {
  const wineInstalledAppModel = useWineInstalledAppModel();
  const wineAppModel = useWineAppConfigModel();
  const installedWineApp = useSelector((state: RootState) =>
    wineInstalledAppModel.selectWineInstalledApp(state, appName)
  );
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppModel.selectWineAppConfig(state, appName, ConfigOrigin.INSTALLED_APP)
  );
  const { navigateToAppConfig, navigateToAppPipeline } = useNavigateApp();
  const [artWorkSrc, setArtWorkSrc] = useState(wineAppConfig?.artworkURL);
  const [noArtWork, setNoArtWork] = useState(false);

  useEffect(() => {
    (async () => {
      if (wineAppConfig?.iconURL === undefined) {
        const artWork = await getAppArtwork(installedWineApp?.appPath);
        setNoArtWork(!artWork);
        setArtWorkSrc(artWork || defaultArtwork);
      }
    })();
  }, [installedWineApp?.appPath]);

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
        <Box display="flex" justifyContent="end">
          {installedWineApp?.pipeline?.status == ProcessStatus.Cancelled ? (
            <Button
              sx={{ borderRadius: 2 }}
              equalSize={40}
              color="secondary"
              title="Installation pending"
              onClick={() =>
                navigateToAppPipeline(appName, {
                  origin: ConfigOrigin.INSTALLED_APP,
                  action: PipelineAction.RESUME
                })
              }
            >
              <Icon color="warning.main" strokeWidth={2} render={ExclamationTriangleIcon} />
            </Button>
          ) : (
            <Button
              sx={{ borderRadius: 2 }}
              equalSize={40}
              color="secondary"
              title="Configure App"
              onClick={() => navigateToAppConfig(appName)}
            >
              <Icon render={Cog6ToothIcon} />
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};
