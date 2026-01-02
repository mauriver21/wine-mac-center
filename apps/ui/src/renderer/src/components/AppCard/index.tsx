import { Body1, Box, Button, Card, CardProps, Icon, Image } from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { RunScriptButton } from '@components/RunScriptButton';
import { RootState } from '@interfaces/RootState';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useEffect, useState } from 'react';
import { ConfigOrigin } from '@constants/enums';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { Cog6ToothIcon, ComputerDesktopIcon, TrashIcon } from '@heroicons/react/24/solid';
import defaultArtwork from '@assets/imgs/header.jpg';
import { Cloud } from '@mui/icons-material';

export interface AppCardProps extends CardProps {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}

export const AppCard: React.FC<AppCardProps> = ({ appName = '', origin, ...rest }) => {
  const { navigateToScript } = useNavigateApp();
  const [removing, setRemoving] = useState(false);
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, origin)
  );
  const [artWorkSrc, setArtWorkSrc] = useState(defaultArtwork);
  const [noArtWork, setNoArtWork] = useState(true);

  const removeScript = async () => {
    setRemoving(true);

    await wineAppConfigModel.remove(appName);
    setRemoving(false);
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
          <RunScriptButton appName={wineAppConfig?.name} origin={origin} />
          {origin === ConfigOrigin.SCRIPTS && (
            <>
              <Button
                sx={{ borderRadius: 2 }}
                equalSize={40}
                color="secondary"
                title="Configure Script"
                disableElevation={false}
                onClick={() => navigateToScript(appName)}
              >
                <Icon size={24} color="text.primary" strokeWidth={2} render={Cog6ToothIcon} />
              </Button>

              <Button
                style={{ display: 'none' }}
                disabled={removing}
                equalSize={40}
                title="Remove Script"
                color="secondary"
                disableElevation={false}
                onClick={() => removeScript()}
              >
                <Icon size={24} color="text.primary" strokeWidth={2} render={TrashIcon} />
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};
