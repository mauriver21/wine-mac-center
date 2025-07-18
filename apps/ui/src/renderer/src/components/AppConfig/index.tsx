import { RegeditIcon } from '@assets/icons';
import {
  Cog6ToothIcon,
  CommandLineIcon,
  CpuChipIcon,
  PlayIcon,
  RectangleStackIcon,
  SparklesIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import {
  Body1,
  Box,
  Button,
  Card,
  CardContent,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  Grid,
  H6,
  Icon,
  Select,
  Stack,
  TableOfContents,
  TextField
} from 'reactjs-ui-core';
import { WineApp } from '@interfaces/WineApp';
import { useNavigate, useParams } from 'react-router-dom';
import { createWineApp } from '@utils/createWineApp';
import { alpha } from '@mui/material';
import { WinetricksSelector } from '@components/WinetricksSelector';
import { FormSchema, useSchema } from './useSchema';
import { useForm } from 'reactjs-ui-form-fields';
import { AppExecutable } from '@interfaces/AppExecutable';
import { ExitCode } from '@constants/enums';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { ArtWorkInput } from '@components/ArtWorkInput';
import { useRefresh } from '@utils/useRefresh';
import { IconInput } from '@components/IconInput';

const ITEM_STYLE = { px: '20px !important' };

export const AppConfig: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const [loading, setLoading] = useState(false);
  const [wineApp, setWineApp] = useState<WineApp>();
  const [appExecutables, setAppExecutables] = useState<AppExecutable[]>([]);
  const [mainExecutablePath, setMainExecutablePath] = useState<string>('');
  const [mainExecutableFlags, setMainExecutableFlags] = useState<string>('');
  const [engineVersion, setEngineVersion] = useState<string>('');
  const { realAppName } = useParams();
  const navigate = useNavigate();
  const schema = useSchema();
  const form = useForm(schema);
  const appConfig = wineApp?.getAppConfig();
  const { signal, refresh } = useRefresh();

  const loadMainExecutable = () => {
    const appConfig = wineApp?.getAppConfig();
    const mainExecutable = appConfig?.executables?.find((item) => item.main);
    const mainExecutablePath = mainExecutable?.path || '';
    const mainExecutableFlags = mainExecutable?.flags || '';
    setMainExecutablePath(mainExecutablePath);
    setMainExecutableFlags(mainExecutableFlags);
  };

  const changeWineEngine = async () => {
    setLoading(true);

    await new Promise((resolve, reject) => {
      wineApp?.extractEngine(engineVersion, {
        onStdOut: console.log,
        onStdErr: console.log,
        onExit: (output) => {
          if (output === ExitCode.Error) {
            reject(`Failed to Extract the Wine Engine ${engineVersion}`);
          }
          resolve(undefined);
        }
      });
    });

    await new Promise((resolve, reject) => {
      wineApp?.wineboot('', {
        onStdOut: console.log,
        onStdErr: console.log,
        onExit: (output) => {
          if (output === ExitCode.Error) {
            reject(`Failed to initialize the Wine Engine ${engineVersion}`);
          }
          resolve(undefined);
        }
      });
    });

    setLoading(false);
  };

  const options = [
    {
      label: 'Wine Config',
      icon: Cog6ToothIcon,
      description: (
        <Body1>
          Opens Wine&apos;s configuration tool to set Windows version, drives, libraries, and audio
          settings.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.winecfg({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Registry Editor',
      icon: RegeditIcon,
      description: (
        <Body1>
          Launches Wine&apos;s Registry Editor to view and modify the Windows-like registry.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.regedit({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Task Manager',
      icon: RectangleStackIcon,
      description: (
        <Body1>Opens Wine&apos;s Task Manager to monitor and manage running Wine processes.</Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.taskmgr({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Command Line',
      icon: CommandLineIcon,
      description: (
        <Body1>
          Starts a Windows-like command prompt for running commands and scripts in Wine.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.cmd({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Control Panel',
      icon: WrenchScrewdriverIcon,
      description: (
        <Body1>
          Opens Wine&apos;s Control Panel to adjust settings like fonts and installed programs.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.control({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Change Engine',
      content: (
        <Stack spacing={1}>
          <Stack direction="row" minWidth={210} pb={1}>
            <Icon strokeWidth={0} size={34} render={SparklesIcon} pr={1} />
            <H6 className={ContentsClass.ItemTitle}>Winetricks</H6>
          </Stack>
          <WinetricksSelector disabled={loading} name="winetricksVerbs" control={form.control} />
          <Stack width="100%" pt={1} alignItems="flex-end">
            <Button
              title={`Run Winetricks`}
              disabled={wineApp === undefined || loading}
              color="secondary"
              sx={{
                width: 90,
                height: 60,
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }}
              onClick={async () => {
                const verbs = (form.getValues() as FormSchema).winetricksVerbs || [];
                const verbsString = verbs.join(' ');
                setLoading(true);

                if (verbsString) {
                  await wineApp?.winetrick(verbsString);
                  form.reset();
                  setLoading(false);
                } else {
                  setLoading(false);
                }
              }}
            >
              <Body1>Run</Body1>
            </Button>
          </Stack>
        </Stack>
      )
    },
    {
      label: 'Executable Config',
      content: (
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
                      setLoading(true);
                      await wineApp?.updateMainExecutablePath?.(path);
                      setLoading(false);
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
                      setLoading(true);
                      await wineApp?.updateMainExecutableFlags?.(mainExecutableFlags);
                      setLoading(false);
                    }}
                  />
                  <IconInput
                    refreshImage={signal}
                    appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                    onInput={async (file) => {
                      file && wineApp?.setupAppIcon({ appIconFile: await file?.arrayBuffer() });
                      refresh();
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={2.5} justifyItems="center" justifyContent="center">
                <ArtWorkInput
                  refreshImage={signal}
                  onInput={async (file) => {
                    file && wineApp?.setupAppArtwork({ appArtWorkFile: await file?.arrayBuffer() });
                    refresh();
                  }}
                  appPath={wineApp?.getWineEnv()?.WINE_APP_PATH}
                  realAppName={realAppName}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Change Engine',
      content: (
        <Stack spacing={1.5}>
          <Stack direction="row" minWidth={210} pb={1}>
            <Icon strokeWidth={0} size={34} render={CpuChipIcon} pr={1} />
            <H6 className={ContentsClass.ItemTitle}>Change Engine</H6>
          </Stack>
          <WineEnginesSelect
            value={engineVersion}
            onChange={(event) => setEngineVersion(event.target.value as string)}
          />
          <Stack width="100%" pt={1} alignItems="flex-end">
            <Button
              title={`Run Change Engine`}
              disabled={wineApp === undefined || loading}
              color="secondary"
              sx={{
                width: 90,
                height: 60,
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }}
              onClick={changeWineEngine}
            >
              <Body1>Run</Body1>
            </Button>
          </Stack>
        </Stack>
      )
    }
  ];

  useEffect(() => {
    (async () => {
      if (realAppName) {
        const wineApp = await createWineApp(realAppName);
        setWineApp(await createWineApp(realAppName));
        setAppExecutables(await wineApp.listAppExecutables());
      }
    })();
  }, [realAppName]);

  useEffect(() => {
    if (appConfig?.name) {
      loadMainExecutable();
      setEngineVersion(appConfig?.engineVersion);
    }
  }, [appConfig?.name]);

  return (
    <Box display="grid" overflow="auto">
      <ContentsArea
        ref={contentsAreaRef}
        style={{
          height: '100%',
          display: 'grid',
          overflow: 'auto',
          gridTemplateRows: 'auto 1fr'
        }}
      >
        <Box>
          <Box
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              boxShadow: (theme) => `inset 0 -1px ${theme.palette.secondary.main}`
            }}
          >
            <H6 color="text.secondary" fontWeight={500}>
              {realAppName}
            </H6>
            <Button color="secondary" onClick={() => navigate('/apps')}>
              Back
            </Button>
          </Box>
          <Box
            sx={{
              height: '1px',
              boxShadow: (theme) => `inset 0 1px ${theme.palette.primary.main}`
            }}
          ></Box>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 250px" overflow="auto">
          <Box
            overflow="auto"
            display="grid"
            sx={{
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
              }
            }}
          >
            <Stack
              className={ContentsClass.ScrollableArea}
              overflow="auto"
              spacing={1}
              sx={{
                overflowX: 'hidden !important'
              }}
              pb={2}
              alignItems="center"
            >
              {options.map((item, index) => (
                <Box
                  width="100%"
                  maxWidth={800}
                  key={index}
                  pt={2}
                  sx={ITEM_STYLE}
                  className={ContentsClass.Item}
                >
                  <Card>
                    <CardContent>
                      {item.content ? (
                        item.content
                      ) : (
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          <Stack direction="row" spacing={1}>
                            <Stack direction="row" minWidth={210} pb={1}>
                              <Icon strokeWidth={0} size={34} render={item.icon} pr={1} />
                              <H6 className={ContentsClass.ItemTitle}>{item.label}</H6>
                            </Stack>
                            <Box pr={2}>{item.description}</Box>
                          </Stack>
                          <Button
                            title={`Run ${item.label}`}
                            disabled={wineApp === undefined || loading}
                            color="secondary"
                            sx={{
                              width: 90,
                              height: 60,
                              border: (theme) => `1px solid ${theme.palette.primary.main}`
                            }}
                            onClick={() => item.method?.()}
                          >
                            <Body1>Run</Body1>
                          </Button>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box borderLeft={(theme) => `1px solid ${theme.palette.primary.main}`}>
            <TableOfContents pt={1} />
          </Box>
        </Box>
      </ContentsArea>
    </Box>
  );
};
