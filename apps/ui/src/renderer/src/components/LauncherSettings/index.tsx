import React, { useEffect } from 'react';
import { CardItem } from '@components/CardItem';
import { Rocket } from '@mui/icons-material';
import { Grid } from 'reactjs-shared-ui';
import { Checkbox, useForm } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useSchema } from './useSchema';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const LauncherSettings: React.FC = () => {
  const { t } = useI18n();
  const { wineApp } = useWineAppContext();
  const schema = useSchema();
  const form = useForm(schema);

  useEffect(() => {
    const launcherConfig = wineApp?.getAppConfig()?.launcherConfig;

    if (launcherConfig) {
      form.fill(launcherConfig);
    }

    form.watch((data) => {
      wineApp?.updateAppLauncherConfig(data);
    });
  }, []);

  return (
    <CardItem icon={Rocket} label={t('launcherSettings')}>
      <Grid container>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="runMainExeOnStartup"
            label={t('startAppOnStartup')}
          />
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="preventMonitorFromBecomingInactive"
            label={t('preventMonitorInactive')}
          />
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="quitAppWhenLauncherIsClosed"
            label={t('quitAppWhenLauncherClosed')}
          />
        </Grid>
      </Grid>
    </CardItem>
  );
};
