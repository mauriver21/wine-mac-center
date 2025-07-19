import { ArtWorkInput } from '@components/ArtWorkInput';
import { IconInput } from '@components/IconInput';
import { AppExecutable } from '@interfaces/AppExecutable';
import { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Icon,
  H6,
  ContentsClass,
  Select,
  TextField,
  CardContent,
  Card
} from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';

export interface ExecutableConfigModuleProps {
  realAppName: string | undefined;
}

export const ExecutableConfigModule: React.FC<ExecutableConfigModuleProps> = ({ realAppName }) => {
  const { wineApp, setLoading, refresh, signal } = useAppConfigContext() || {};
  const [appExecutables, setAppExecutables] = useState<AppExecutable[]>([]);
  const [mainExecutablePath, setMainExecutablePath] = useState<string>('');
  const [mainExecutableFlags, setMainExecutableFlags] = useState<string>('');

  const appConfig = wineApp?.getAppConfig();

  const loadMainExecutable = () => {
    const appConfig = wineApp?.getAppConfig();
    const mainExecutable = appConfig?.executables?.find((item) => item.main);
    const mainExecutablePath = mainExecutable?.path || '';
    const mainExecutableFlags = mainExecutable?.flags || '';
    setMainExecutablePath(mainExecutablePath);
    setMainExecutableFlags(mainExecutableFlags);
  };

  useEffect(() => {
    if (appConfig?.name) {
      loadMainExecutable();
    }
  }, [appConfig?.name]);

  useEffect(() => {
    (async () => {
      wineApp && setAppExecutables(await wineApp.listAppExecutables());
    })();
  }, [appConfig?.id]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={PlayIcon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>Executable Config</H6>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={9.5}>
                <Stack spacing={1.5}>
                  <Select
                    label="Select the main executable"
                    value={mainExecutablePath}
                    options={appExecutables.map((item) => ({
                      value: item.path,
                      label: item.name
                    }))}
                    onChange={async (event) => {
                      const path = event.target.value as string;
                      setMainExecutablePath(event.target.value as string);
                      setLoading?.(true);
                      await wineApp?.updateMainExecutablePath?.(path);
                      setLoading?.(false);
                    }}
                    disabled={!Boolean(mainExecutablePath)}
                  />
                  <TextField
                    label="Exe flags"
                    value={mainExecutableFlags}
                    onChange={(event) => {
                      const flags = event.currentTarget.value;
                      setMainExecutableFlags(flags);
                    }}
                    onBlur={async () => {
                      setLoading?.(true);
                      await wineApp?.updateMainExecutableFlags?.(mainExecutableFlags);
                      setLoading?.(false);
                    }}
                  />
                  <IconInput
                    refreshImage={signal}
                    appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                    onInput={async (file) => {
                      file && wineApp?.setupAppIcon({ appIconFile: await file?.arrayBuffer() });
                      refresh?.();
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={2.5} justifyItems="center" justifyContent="center">
                <ArtWorkInput
                  refreshImage={signal}
                  onInput={async (file) => {
                    file && wineApp?.setupAppArtwork({ appArtWorkFile: await file?.arrayBuffer() });
                    refresh?.();
                  }}
                  appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                  realAppName={realAppName}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
