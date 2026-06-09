import { Grid, Stack, Icon, H6, ContentsClass, CardContent, Card } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useWineAppContext } from '@hooks/useWineAppContext';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import { AppExecutablesSelector } from '@components/AppExecutablesSelector';

export interface ExecutablesConfigModuleProps {}

export const AppExecutablesConfigModule: React.FC<ExecutablesConfigModuleProps> = () => {
  const { t } = useI18n();
  const { wineApp } = useWineAppContext() || {};
  const appConfig = wineApp?.getAppConfig();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={PlayIcon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{t('executablesConfig')}</H6>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <AppExecutablesSelector
                value={appConfig?.executables}
                onChange={(executables) => {
                  wineApp?.setExecutables({ executables });
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
