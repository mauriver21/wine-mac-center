import { Button } from '@components/Button';
import { Card, CardContent, Stack, Icon, H6, ContentsClass } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LauncherConfigItemProps {
  icon: React.FC;
  label?: string;
  method: () => void;
}

export const LauncherConfigItem: React.FC<LauncherConfigItemProps> = ({ label, icon, method }) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent>
        <Stack pt={1} direction="row" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={icon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{label}</H6>
            </Stack>
          </Stack>
          <Button onClick={method}>{t('open')}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
