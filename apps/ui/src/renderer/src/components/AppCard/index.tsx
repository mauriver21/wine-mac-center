import { Box, Card, CardProps, Image } from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { InstallAppButton } from '@components/InstallAppButton';
import { RootState } from '@interfaces/RootState';
import { useWineAppModel } from '@models/useWineAppModel';

export interface AppCardProps extends CardProps {
  appConfigId?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ appConfigId, ...rest }) => {
  const wineAppModel = useWineAppModel();
  const wineApp = useSelector((state: RootState) => wineAppModel.selectWineApp(state, appConfigId));

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
          src={wineApp?.imgSrc}
          height="100%"
          width="100%"
          style={{
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: 12
          }}
        />
        <Box display="flex" justifyContent="end">
          <InstallAppButton appConfigId={wineApp?.appConfigId} />
        </Box>
      </Box>
    </Card>
  );
};
