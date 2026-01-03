import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  Grid,
  H6,
  Icon,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';
import { alpha, Chip, Divider } from '@mui/material';
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
import { ConfigOrigin, ScriptOperation } from '@constants/enums';
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

const ITEM_STYLE = { px: '20px !important' };

export const PipelineScript: React.FC = () => {
  const { appName } = useParams();
  const schema = useSchema();
  const form = useForm(schema);
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const { navigateToScripts } = useNavigateApp();
  const wineAppConfigModel = useWineAppConfigModel();
  const appConfig = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppConfig(state, appName, ConfigOrigin.SCRIPTS)
  );
  const [loading, setLoading] = useState(false);
  const [iconSrc, setIconSrc] = useState('');
  const [artworkSrc, setArtWorkSrc] = useState('');
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
    <CardItem icon={PencilSquareIcon} label="Script Details">
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          control={form.control}
          name="appName"
          label="Application Name"
        />
      </Stack>
    </CardItem>,
    <CardItem icon={CpuChipIcon} label="Wine Engine">
      <WineEnginesSelect fullWidth control={form.control} name="engineVersion" />
    </CardItem>,
    <CardItem icon={SparklesIcon} label="Winetricks">
      <Grid container>
        <Grid item xs={4}>
          <Checkbox control={form.control} name="dxvkEnabled" label="Enable DXVK" />
        </Grid>
        <Grid mt={1} item xs={12}>
          <WinetricksSelector control={form.control} name="winetricksVerbs" />
        </Grid>
      </Grid>
    </CardItem>,
    <CardItem icon={PaintBrushIcon} label="Style">
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
            appName={'No Artwork'}
            onInput={async (file) => {
              file && setArtWorkSrc(blobToURL(await file?.arrayBuffer()));
            }}
          />
        </Box>
      </>
    </CardItem>,
    <CardItem icon={PlayCircleIcon} label="Installation Script">
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
                    { value: ScriptOperation.DOWNLOAD, label: 'Download File' },
                    { value: ScriptOperation.COPY, label: 'Copy' },
                    { value: ScriptOperation.DECOMPRESS, label: 'Extract' },
                    { value: ScriptOperation.REMOVE, label: 'Remove' },
                    { value: ScriptOperation.RUN_WINDOWS_EXE, label: 'Run Windows EXE' },
                    { value: ScriptOperation.SET_MAIN_EXE, label: 'Set Main EXE' },
                    { value: ScriptOperation.MOUNT_DISK_IMAGE, label: 'Mount Disk Image' }
                  ]}
                />
                {operation === ScriptOperation.DOWNLOAD && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.url`}
                    label="File URL"
                  />
                )}
                {operation === ScriptOperation.COPY && (
                  <>
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.from`}
                      InputProps={{
                        startAdornment: <Chip label={WINE_DOWNLOADS_PATH} sx={{ mr: 1 }} />
                      }}
                      label="From Path"
                      placeholder="/your/relative/path"
                    />
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.target`}
                      InputProps={{
                        startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
                      }}
                      label="To Path"
                      placeholder="/your/relative/app/target/path"
                    />
                  </>
                )}
                {operation === ScriptOperation.REMOVE && <TextField label="Target Path" />}
                {operation === ScriptOperation.DECOMPRESS && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.path`}
                    InputProps={{
                      startAdornment: <Chip label={WINE_DOWNLOADS_PATH} sx={{ mr: 1 }} />
                    }}
                    label="From Path"
                    placeholder="/your/relative/path"
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
                      label="Set Main Exe"
                      placeholder="/your/relative/path"
                    />
                    <TextField
                      control={form.control}
                      name={`pipelineScripts.${index}.exeFlags`}
                      label="Exe Flags"
                    />
                  </>
                )}
                {operation === ScriptOperation.RUN_WINDOWS_EXE && (
                  <TextField
                    control={form.control}
                    name={`pipelineScripts.${index}.exePath`}
                    label="Executable Path"
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
                    label="Disk Image Path"
                    placeholder="/your/relative/path"
                  />
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
              name: 'Extract File'
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
              name: 'Run Windows Exe'
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
              name: 'Download setup executable'
            }
          ];
          break;
        case ScriptOperation.COPY:
          result = [
            ...result,
            {
              from: item.from || '',
              target: item.target || '',
              operation: item.operation,
              name: 'Copy file'
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
              name: 'Set main exe'
            }
          ];
          break;
        case ScriptOperation.MOUNT_DISK_IMAGE:
          result = [
            ...result,
            {
              diskImagePath: item.diskImagePath || '',
              operation: item.operation,
              name: 'Mount disk image'
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
    const { originalAppName, winetricksVerbs = [], iconFile, artworkFile, appName, ...rest } = data;
    setLoading(true);

    const pipelineScripts = mapPipelineScripts(rest.pipelineScripts);
    const formattedData = {
      name: appName,
      origin: ConfigOrigin.SCRIPTS,
      pipelineScripts,
      winetricks: { verbs: winetricksVerbs },
      iconFile: await iconFile?.arrayBuffer(),
      artworkFile: await artworkFile?.arrayBuffer()
    };

    if (appConfig?.name) {
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

  useEffect(() => {
    if (appConfig) {
      const {
        name,
        pipelineScripts = [],
        winetricks,
        engineVersion = '',
        dxvkEnabled = false,
        artworkFile = undefined,
        iconFile = undefined,
        ...rest
      } = appConfig;

      form.fill({
        appName: name,
        originalAppName: appName || '',
        pipelineScripts: pipelineScripts as FormSchema['pipelineScripts'],
        winetricksVerbs: winetricks?.verbs || [],
        dxvkEnabled,
        engineVersion,
        artworkFile: undefined,
        iconFile: undefined,
        ...rest
      });

      setTimeout(() => {
        form.trigger();
      }, 200);
    }
  }, [appConfig?.name]);

  useEffect(() => {
    setArtWorkSrc(appConfig?.artworkURL || '');
    setIconSrc(appConfig?.iconURL || '');
  }, [appConfig?.name]);

  return (
    <form onSubmit={form.handleSubmit(submit as any)} style={{ display: 'contents' }}>
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
                {appConfig?.name ? `${appConfig?.name} Script` : `Create Script`}
              </H6>
              <Button onClick={navigateToScripts}>Back</Button>
            </Box>
            <Box
              sx={{
                height: '1px',
                boxShadow: (theme) => `inset 0 1px ${theme.palette.secondary.light}`
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
              <Stack
                borderTop={(theme) => `1px solid ${theme.palette.secondary.light}`}
                p={2}
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                {appConfig?.name ? (
                  <Button disabled={loading || form.isInvalid()} type="submit">
                    Update
                  </Button>
                ) : (
                  <Button disabled={loading || form.isInvalid()} type="submit">
                    Create
                  </Button>
                )}
              </Stack>
            </Box>
            <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
              <TableOfContents pt={1} />
            </Box>
          </Box>
        </ContentsArea>
      </Box>
    </form>
  );
};
