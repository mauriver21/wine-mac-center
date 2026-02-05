import React, { useEffect } from 'react';
import { CardItem } from '@components/CardItem';
import { Rocket } from '@mui/icons-material';
import { Grid } from 'reactjs-shared-ui';
import { Checkbox, useForm } from 'reactjs-shared-ui/forms';
import { useSchema } from './useSchema';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const LauncherSettings: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const schema = useSchema();
  const form = useForm(schema);

  useEffect(() => {
    const launcherConfig = wineApp?.getAppConfig()?.launcherConfig;

    if (launcherConfig) {
      form.fill(launcherConfig);
    }

    return () => {
      wineApp?.updateAppLauncherConfig(form.getFormValues());
    };
  }, []);

  return (
    <CardItem icon={Rocket} label="Launcher Settings">
      <Grid container>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="runMainExeOnStartup"
            label="Start the app automatically on startup"
          />
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="preventMonitorFromBecomingInactive"
            label="Prevent the monitor from becoming inactive"
          />
        </Grid>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="quitAppWhenLauncherIsClosed"
            label="Quit app when launcher is closed"
          />
        </Grid>
      </Grid>
    </CardItem>
  );
};
