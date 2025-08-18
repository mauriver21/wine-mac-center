import { Box, Card, CardProps, Image } from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { InstallAppButton } from '@components/InstallAppButton';
import { RootState } from '@interfaces/RootState';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useMemo } from 'react';
import { buildAppUrls } from '@utils/buildAppUrls';
import { ConfigOrigin } from '@constants/enums';

export interface AppCardProps extends CardProps {
  appName?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ appName, ...rest }) => {
  const wineAppModel = useWineAppConfigModel();
  const wineAppConfig = useSelector((state: RootState) =>
    wineAppModel.selectWineAppConfig(state, appName)
  );
  const appURLs = useMemo(() => buildAppUrls(appName), []);

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
        <Image
          src={appURLs.artworkURL}
          height="100%"
          width="100%"
          style={{
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: 12
          }}
        />
        <Box display="flex" justifyContent="end">
          <InstallAppButton appName={wineAppConfig?.name} origin={ConfigOrigin.CLOUD} />
        </Box>
      </Box>
    </Card>
  );
};
