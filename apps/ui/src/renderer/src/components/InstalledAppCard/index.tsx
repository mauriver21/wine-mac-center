import { AppCardButton } from '@components/AppCardButton';
import { Body1, Box, Card, CardProps, Image } from 'reactjs-shared-ui';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ConfigOrigin, PipelineAction, ProcessStatus } from '@constants/enums';
import { Folder, Pending } from '@mui/icons-material';
import { getAppArtwork } from '@utils/getAppArtwork';
import { RootState } from '@interfaces/RootState';
import { useEffect, useState } from 'react';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { useSelector } from 'react-redux';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import defaultArtwork from '@assets/imgs/header.jpg';
import { showItemInFolder } from '@utils/showItemInFolder';

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
  }, [installedWineApp?.artworkURL]);

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
        <Box display="flex" justifyContent="end" gap={1}>
          <AppCardButton
            title="Reveal in Finder"
            icon={Folder}
            onClick={() => {
              installedWineApp?.appPath && showItemInFolder(installedWineApp.appPath);
            }}
          />
          {installedWineApp?.pipeline?.status == ProcessStatus.Cancelled ? (
            <AppCardButton
              title="Installation pending"
              icon={Pending}
              onClick={() =>
                navigateToAppPipeline(appName, {
                  origin: ConfigOrigin.INSTALLED_APP,
                  action: PipelineAction.RESUME
                })
              }
            />
          ) : (
            <AppCardButton
              title="Configure App"
              icon={Cog6ToothIcon}
              onClick={() => navigateToAppConfig(appName)}
            />
          )}
        </Box>
      </Box>
    </Card>
  );
};
