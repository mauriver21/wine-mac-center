import { ArtWorkInput } from '@components/ArtWorkInput';
import { IconInput } from '@components/IconInput';
import { useEffect, useState } from 'react';
import { Grid, Stack, Icon, H6, ContentsClass, CardContent, Card, Body1 } from 'reactjs-shared-ui';
import { useAppConfigContext } from '@hooks/useAppConfigContext';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import { FilePathInput } from '@components/FilePathInput';
import { Button } from '@components/Button';
import { FileFilter } from '@constants/enums';
import { TextField } from 'reactjs-shared-ui/forms';

export interface ExecutableConfigModuleProps {
  appName: string | undefined;
}

export const ExecutableConfigModule: React.FC<ExecutableConfigModuleProps> = ({ appName }) => {
  const { wineApp, loading, setLoading, refresh, signal } = useAppConfigContext() || {};
  const [driveCPath, setDriveCPath] = useState<string>('');
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

  const runExe = async () => {
    setLoading?.(true);
    await wineApp?.runMainExe();
    setLoading?.(false);
  };

  useEffect(() => {
    if (appConfig?.name) {
      loadMainExecutable();
    }
  }, [appConfig?.name]);

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
              <H6 className={ContentsClass.ItemTitle}>Executable Config</H6>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={9.5}>
                <Stack spacing={1.5}>
                  <FilePathInput
                    relativeToDriveC
                    noSelectedFileLabel="Select Executable"
                    selectedFileLabel="Change Executable"
                    defaultPath={driveCPath}
                    filters={FileFilter.WindowsExecutables}
                    value={mainExecutablePath}
                    onInput={async (path) => {
                      setMainExecutablePath(path);
                      setLoading?.(true);
                      await wineApp?.saveMainExecutablePath?.({ path });
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
                    type="app"
                    refreshImage={signal}
                    appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                    onInput={async (file) => {
                      file && wineApp?.saveAppIcon({ appIconFile: await file?.arrayBuffer() });
                      refresh?.();
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={2.5} justifyItems="center" justifyContent="center">
                <ArtWorkInput
                  type="app"
                  refreshImage={signal}
                  onInput={async (file) => {
                    file && wineApp?.saveAppArtwork({ appArtWorkFile: await file?.arrayBuffer() });
                    refresh?.();
                  }}
                  appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                  appName={appName}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack width="100%" alignItems="flex-end">
                  <Button
                    title={`Run Main Executable`}
                    disabled={wineApp === undefined || loading}
                    color="secondary"
                    onClick={runExe}
                    sx={{
                      width: 90,
                      height: 60,
                      border: (theme) => `1px solid ${theme.palette.primary.main}`
                    }}
                  >
                    <Body1>Run</Body1>
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
