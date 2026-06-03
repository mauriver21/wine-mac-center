import { Button } from '@components/Button';
import { Version } from '@components/Version';
import { InfoOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import { Card, CardContent, Stack, Icon, H6, ContentsClass, Body1 } from 'reactjs-shared-ui';

export const AppVersion: React.FC = () => {
  return (
    <Card sx={{ padding: 0 }}>
      <CardContent sx={{ pb: '10px !important' }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={1}>
              <Icon strokeWidth={0} size={34} render={InfoOutlined} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{t('version')}</H6>
            </Stack>
            <Body1>
              <Version />
            </Body1>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button>{t('checkForUpdates')}</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
