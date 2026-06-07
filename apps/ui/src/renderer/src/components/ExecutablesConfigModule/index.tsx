import { Grid, Stack, Icon, H6, ContentsClass, CardContent, Card } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useEffect, useState } from 'react';
import { useWineAppContext } from '@hooks/useWineAppContext';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import { ExecutablesSelector } from '@components/ExecutablesSelector';

export interface ExecutablesConfigModuleProps {}

export const ExecutablesConfigModule: React.FC<ExecutablesConfigModuleProps> = () => {
  const { t } = useI18n();
  const { wineApp } = useWineAppContext() || {};
  const [driveCPath, setDriveCPath] = useState<string>('');
  const appConfig = wineApp?.getAppConfig();

  useEffect(() => {
    wineApp && setDriveCPath(wineApp.getWineEnv().WINE_APP_DRIVE_C_PATH);
  }, [appConfig?.name]);

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
              <ExecutablesSelector
                value={appConfig?.executables}
                filePathInputProps={{ defaultPath: driveCPath, relativeToDriveC: true }}
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
