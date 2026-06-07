import React, { useEffect, useState } from 'react';
import { Box, ContentsClass, Grid, Icon, Stack } from 'reactjs-shared-ui';
import { Chip, Divider } from '@mui/material';
import { DEFAULT_PIPELINE_SCRIPT, FormSchema, useSchema } from './useSchema';
import { TextField, Checkbox, useForm, Select } from 'reactjs-shared-ui/forms';
import { useFieldArray } from 'react-hook-form';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { WinetricksSelector } from '@components/WinetricksSelector';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CpuChipIcon,
  PaintBrushIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  SparklesIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import { CardItem } from '@components/CardItem';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { ConfigOrigin, License, ScriptOperation } from '@constants/enums';
import { ENV } from '@constants/envs';
import { getRelativeWinePath } from '@utils/getRelativeWinePath';
import { DRIVE_C_PATH as RELATIVE_DRIVE_C_PATH } from '@constants/paths';
import { Button } from '@components/Button';
import { PipelineScript as PipelineScriptType } from '@interfaces/PipelineScript';
import { useParams } from 'react-router-dom';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useSelector } from 'react-redux';
import { RootState } from '@interfaces/RootState';
import { IconInput } from '@components/IconInput';
import { blobToURL } from '@utils/blobToURL';
import { ArtWorkInput } from '@components/ArtWorkInput';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { LauncherImgInput } from '@components/LauncherImgInput';
import { useQueryParam } from '@hooks/useQueryParam';
import { buildUniqueAppName } from '@utils/buildUniqueAppName';
import { blobUrlToFile } from '@utils/blobUrlToFile';
import { DEFAULT_WINETRICKS_VERSION } from '@constants/constants';
import { Rocket } from '@mui/icons-material';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { LicensesAutocomplete } from '@components/LicensesAutocomplete';

const ITEM_STYLE = { px: '20px !important' };

export const PipelineScript: React.FC = () => {
  const { t } = useI18n();
  const { appName: appNameParam } = useParams();
  const params = useQueryParam();
  const appNameToCopy = params.get('appNameToCopy') || '';
  const appName = appNameToCopy || appNameParam;
  const schema = useSchema();
  const form = useForm(schema);
  const { navigateToScripts } = useNavigateApp();
  const wineAppConfigModel = useWineAppConfigModel();
  const appConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, ConfigOrigin.SCRIPTS)
  );
  const [loading, setLoading] = useState(false);
  const [iconSrc, setIconSrc] = useState('');
  const [artworkSrc, setArtWorkSrc] = useState('');
  const [launcherImgSrc, setLauncherImgSrc] = useState('');
  const { fields, insert, remove } = useFieldArray<FormSchema>({
    name: 'pipelineScripts',
    control: form.control
  });
  const WINE_DOWNLOADS_PATH = `$HOME${getRelativeWinePath(ENV.WINE_DOWNLOADS_PATH)}`;
  const DRIVE_C_PATH = `$WINE_APP_PREFIX_PATH/${RELATIVE_DRIVE_C_PATH}`;
  const VOLUMES_PATH = `/Volumes`;

  const insertAfter = (index: number) => insert(index + 1, DEFAULT_PIPELINE_SCRIPT);
  const insertBefore = (index: number) => insert(index, DEFAULT_PIPELINE_SCRIPT);

  const modules = [
    <CardItem icon={PencilSquareIcon} label={t('scriptDetails')}>
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          control={form.control}
          name="appName"
          label={t('applicationName')}
        />
        <LicensesAutocomplete name="license" control={form.control} />
      </Stack>
    </CardItem>,
    <CardItem icon={CpuChipIcon} label={t('wineEngine')}>
      <WineEnginesSelect fullWidth control={form.control} name="engineVersion" />
    </CardItem>,
    <CardItem icon={SparklesIcon} label="Winetricks">
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Checkbox control={form.control} name="dxvkEnabled" label={t('enableDXVK')} />
          </Stack>
        </Grid>
        <Grid mt={1} item xs={12}>
          <WinetricksSelector
            showSelectedVerbs
            control={form.control}
            name="winetricksVerbs"
            winetricksVersionSelectProps={{
              control: form.control,
              name: 'winetricksVersion'
            }}
          />
        </Grid>
      </Grid>
    </CardItem>,
    <CardItem icon={PaintBrushIcon} label={t('style')}>
      <>
        <Divider />
        <Box pt={2} display="flex" gap={4} justifyContent="center">
          <IconInput
            type="image"
            imgSrc={iconSrc}
            name="iconFile"
            control={form.control}
            onInput={async (file) => {
              file && setIconSrc(blobToURL(await file?.arrayBuffer()));
            }}
          />
          <ArtWorkInput
            control={form.control}
            name="artworkFile"
            type="image"
            imgSrc={artworkSrc}
            appName={t('noArtwork')}
            onInput={async (file) => {
              file && setArtWorkSrc(blobToURL(await file?.arrayBuffer()));
            }}
          />
          <LauncherImgInput
            control={form.control}
            name="launcherImgFile"
            type="image"
            imgSrc={launcherImgSrc}
            appName={t('noLauncherImage')}
            onInput={async (file) => {
              file && setLauncherImgSrc(blobToURL(await file?.arrayBuffer()));
            }}
          />
        </Box>
      </>
    </CardItem>,
    <CardItem icon={Rocket} label={t('launcherSettings')}>
      <Grid container>
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="launcherConfig.runMainExeOnStartup"
            label={t('startAppOnStartup')}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="launcherConfig.preventMonitorFromBecomingInactive"
            label={t('preventMonitorInactive')}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Checkbox
            control={form.control}
            name="launcherConfig.quitAppWhenLauncherIsClosed"
            label={t('quitAppWhenLauncherClosed')}
          />
        </Grid>
      </Grid>
    </CardItem>,
    <CardItem icon={PlayCircleIcon} label={t('installationScript')}>
      <Stack spacing={2}>
        {fields.map((field, index) => {
          const operation = form.watch(`pipelineScripts.${index}.operation`);

          return (
            <Box
              position="relative"
              key={field.id}
              bgcolor="secondary.dark"
              p={2}
              borderRadius={2}
              pt={5}
              sx={{ '&:hover .step-actions': { display: 'flex' } }}
            >
              <Box position="absolute" top={-7} left={20}>
                <Chip sx={{ opacity: 1 }} label={`Step ${index + 1}`} />
              </Box>
              <Box
                className="step-actions"
                sx={{ display: 'none' }}
                position="absolute"
                top={-7}
                left={-15}
              >
                {fields.length > 1 ? (
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 10 }}
                    equalSize={32}
                    onClick={() => remove(index)}
                    title="Remove Step"
                  >
                    <Icon strokeWidth={3} render={TrashIcon} />
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
              <Stack
                direction="row"
                spacing={1}
                position="absolute"
                top={0}
                right={0}
                className="step-actions"
                sx={{ display: 'none' }}
              >
                {index > 0 ? (
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 10 }}
                    equalSize={32}
                    onClick={() => insertBefore(index)}
                    title="Add Prev Step"
                  >
                    <Icon strokeWidth={3} render={ChevronLeftIcon} />
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant="contained"
                  sx={{ borderRadius: 10 }}
                  equalSize={32}
                  onClick={() => insertAfter(index)}
                  title="Add Next Step"
                >
                  <Icon strokeWidth={3} render={ChevronRightIcon} />
                </Button>
              </Stack>
              <Stack spacing={2}>
                <Select
                  label="Operation"
                  control={form.control}
                  name={`pipelineScripts.${index}.operation`}
                  options={[
                    { value: ScriptOperation.DOWNLOAD, label: t('downloadFile') },
                    { value: ScriptOperation.COPY, label: t('copy') },
                    { value: ScriptOperation.DECOMPRESS, label: t('extract') },
                    { value: ScriptOperation.REMOVE, label: t('remove') },
                    { value: ScriptOperation.RUN_WINDOWS_EXE, label: t('runWindowsExe') },
                    { value: ScriptOperation.SET_MAIN_EXE, label: t('setMainExe') },
                    { value: ScriptOperation.MOUNT_DISK_IMAGE, label: t('mountDiskImage') },
                    { value: ScriptOperation.DOWNLOAD_STEAM_APP, label: t('downloadSteamApp') }
                  ]}
                />
                {operation === ScriptOperation.DOWNLOAD && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.url`}
                    label={t('fileURL')}
                  />
                )}
                {operation === ScriptOperation.COPY && (
                  <>
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.from`}
                      InputProps={{
                        startAdornment: (
                          <Box mr={2}>
                            <Select
                              control={form.control}
                              name={`pipelineScripts.${index}.baseFromPath`}
                              sx={{ height: 34 }}
                              options={[
                                { value: WINE_DOWNLOADS_PATH, label: WINE_DOWNLOADS_PATH },
                                { value: DRIVE_C_PATH, label: DRIVE_C_PATH },
                                { value: VOLUMES_PATH, label: VOLUMES_PATH }
                              ]}
                              value={WINE_DOWNLOADS_PATH}
                            />
                          </Box>
                        )
                      }}
                      label={t('fromPath')}
                      placeholder={t('fromPathExample')}
                    />
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.target`}
                      InputProps={{
                        startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
                      }}
                      label={t('toPath')}
                      placeholder={t('toPathExample')}
                    />
                  </>
                )}
                {operation === ScriptOperation.REMOVE && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.removePath`}
                    InputProps={{
                      startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
                    }}
                    label={t('path')}
                    placeholder={t('pathExample')}
                  />
                )}
                {operation === ScriptOperation.DECOMPRESS && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.path`}
                    InputProps={{
                      startAdornment: <Chip label={WINE_DOWNLOADS_PATH} sx={{ mr: 1 }} />
                    }}
                    label={t('downloadsPath')}
                    placeholder={t('fromPathExample')}
                  />
                )}
                {operation === ScriptOperation.SET_MAIN_EXE && (
                  <>
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.mainExePath`}
                      InputProps={{
                        startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
                      }}
                      label={t('setMainExe')}
                      placeholder={t('toPathExample')}
                    />
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.exeFlags`}
                      label={t('exeFlags')}
                    />
                  </>
                )}
                {operation === ScriptOperation.RUN_WINDOWS_EXE && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.exePath`}
                    label={t('executablePath')}
                    InputProps={{
                      startAdornment: (
                        <Box mr={2}>
                          <Select
                            control={form.control}
                            name={`pipelineScripts.${index}.baseExePath`}
                            sx={{ height: 34 }}
                            options={[
                              { value: WINE_DOWNLOADS_PATH, label: WINE_DOWNLOADS_PATH },
                              { value: DRIVE_C_PATH, label: DRIVE_C_PATH },
                              { value: VOLUMES_PATH, label: VOLUMES_PATH }
                            ]}
                            value={WINE_DOWNLOADS_PATH}
                          />
                        </Box>
                      )
                    }}
                  />
                )}
                {operation === ScriptOperation.MOUNT_DISK_IMAGE && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.diskImagePath`}
                    InputProps={{
                      startAdornment: <Chip label={WINE_DOWNLOADS_PATH} sx={{ mr: 1 }} />
                    }}
                    label={t('diskImagePath')}
                    placeholder={t('relativePathExample')}
                  />
                )}
                {operation === ScriptOperation.DOWNLOAD_STEAM_APP && (
                  <>
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.steamAppId`}
                      label={t('applicationId')}
                    />
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.installDirName`}
                      label={t('installDirName')}
                    />
                  </>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </CardItem>
  ];

  const mapPipelineScripts = (data: FormSchema['pipelineScripts']): PipelineScriptType[] => {
    let result: PipelineScriptType[] = [];
    for (const item of data) {
      switch (item.operation) {
        case ScriptOperation.DECOMPRESS:
          result = [
            ...result,
            {
              path: item.path || '',
              operation: item.operation,
              name: t('extractFile')
            }
          ];
          break;
        case ScriptOperation.RUN_WINDOWS_EXE:
          result = [
            ...result,
            {
              exePath: item.exePath || '',
              baseExePath: item.baseExePath || '',
              operation: item.operation,
              name: t('runWindowsExe')
            }
          ];
          break;
        case ScriptOperation.DOWNLOAD:
          result = [
            ...result,
            {
              url: item.url || '',
              downloadName: '',
              operation: item.operation,
              name: t('downloadSetupExecutable')
            }
          ];
          break;
        case ScriptOperation.COPY:
          result = [
            ...result,
            {
              baseFromPath: item.baseFromPath || '',
              from: item.from || '',
              target: item.target || '',
              operation: item.operation,
              name: t('copyFile')
            }
          ];
          break;
        case ScriptOperation.SET_MAIN_EXE:
          result = [
            ...result,
            {
              mainExePath: item.mainExePath || '',
              operation: item.operation,
              exeFlags: item.exeFlags,
              name: t('setMainExe')
            }
          ];
          break;
        case ScriptOperation.MOUNT_DISK_IMAGE:
          result = [
            ...result,
            {
              diskImagePath: item.diskImagePath || '',
              operation: item.operation,
              name: t('mountDiskImage')
            }
          ];
          break;
        case ScriptOperation.REMOVE:
          result = [
            ...result,
            {
              removePath: item.removePath || '',
              operation: item.operation,
              name: t('removeFileOrFolder')
            }
          ];
          break;
        case ScriptOperation.DOWNLOAD_STEAM_APP:
          result = [
            ...result,
            {
              steamAppId: item.steamAppId || '',
              installDirName: item.installDirName || '',
              operation: item.operation,
              name: t('downloadSteamApp')
            }
          ];
          break;
        default:
          break;
      }
    }
    return result;
  };

  const submit = async (data: FormSchema) => {
    const {
      originalAppName,
      winetricksVerbs = [],
      winetricksVersion,
      iconFile,
      artworkFile,
      launcherImgFile,
      appName,
      ...rest
    } = data;
    setLoading(true);

    const pipelineScripts = mapPipelineScripts(rest.pipelineScripts);
    const formattedData = {
      name: appName,
      origin: ConfigOrigin.SCRIPTS,
      pipelineScripts,
      winetricks: { verbs: winetricksVerbs, version: winetricksVersion },
      iconFile: await iconFile?.arrayBuffer(),
      artworkFile: await artworkFile?.arrayBuffer(),
      launcherImgFile: await launcherImgFile?.arrayBuffer()
    };

    if (appConfig?.name && !appNameToCopy) {
      await wineAppConfigModel.update({
        ...rest,
        originalAppName,
        ...formattedData
      });
    } else {
      await wineAppConfigModel.create({
        ...rest,
        ...formattedData
      });
    }

    setLoading(false);
    navigateToScripts();
  };

  const fillForm = async () => {
    if (appConfig) {
      const {
        pipelineScripts = [],
        winetricks,
        engineVersion = '',
        dxvkEnabled = false,
        artworkFile = undefined,
        iconFile = undefined,
        launcherImgFile = undefined,
        license = License.Empty,
        ...rest
      } = appConfig;

      let { name } = appConfig;
      let copiedArtworkFile: File | undefined;
      let copiedIconFile: File | undefined;
      let copiedLauncherImgFile: File | undefined;

      if (appNameToCopy) {
        name = await buildUniqueAppName(name);

        if (appConfig?.artworkURL) {
          copiedArtworkFile = await blobUrlToFile(appConfig.artworkURL, 'artwork-img');
        }

        if (appConfig?.iconURL) {
          copiedIconFile = await blobUrlToFile(appConfig.iconURL, 'icon-img');
        }

        if (appConfig?.launcherImgURL) {
          copiedLauncherImgFile = await blobUrlToFile(appConfig.launcherImgURL, 'launcher-img');
        }
      }

      form.fill({
        appName: name,
        originalAppName: appName || '',
        pipelineScripts: pipelineScripts as FormSchema['pipelineScripts'],
        winetricksVerbs: winetricks?.verbs || [],
        dxvkEnabled,
        engineVersion,
        artworkFile: copiedArtworkFile || undefined,
        iconFile: copiedIconFile || undefined,
        launcherImgFile: copiedLauncherImgFile || undefined,
        winetricksVersion: winetricks?.version || DEFAULT_WINETRICKS_VERSION,
        license,
        ...rest
      });

      setTimeout(() => {
        form.trigger();
      }, 200);
    }
  };

  const mainTitle = () => {
    if (appNameToCopy) return t('copyScript');
    return appConfig?.name ? `${appConfig?.name} ${t('script')}` : t('createScript');
  };

  useEffect(() => {
    fillForm();
  }, [appConfig?.name]);

  useEffect(() => {
    setArtWorkSrc(appConfig?.artworkURL || '');
    setIconSrc(appConfig?.iconURL || '');
    setLauncherImgSrc(appConfig?.launcherImgURL || '');
  }, [appConfig?.name]);

  return (
    <form onSubmit={form.handleSubmit(submit as any)} style={{ display: 'contents' }}>
      <ConfigLayout
        mainTitle={mainTitle()}
        contentSlot={
          <Stack
            overflow="auto"
            spacing={1}
            sx={{
              overflowX: 'hidden !important'
            }}
            pb={2}
            alignItems="center"
          >
            {modules.map((item, index) => (
              <Box
                key={index}
                width="100%"
                maxWidth={800}
                pt={2}
                sx={ITEM_STYLE}
                className={ContentsClass.Item}
              >
                {item}
              </Box>
            ))}
          </Stack>
        }
        actionsSlot={
          <Button disabled={loading || form.isInvalid()} type="submit">
            {t('save')}
          </Button>
        }
      />
    </form>
  );
};
