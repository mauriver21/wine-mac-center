import { LanguagesSelect } from '@components/LanguagesSelect';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { Card, CardContent, ContentsClass, H6, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const Languages: React.FC = () => {
  const { refresh } = useConfigLayout();
  const { t } = useI18n();

  return (
    <Card sx={{ padding: 0 }}>
      <CardContent sx={{ pb: '10px !important' }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={GlobeAltIcon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{t('language')}</H6>
            </Stack>
          </Stack>
          <LanguagesSelect
            onChange={() => {
              refresh();
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
