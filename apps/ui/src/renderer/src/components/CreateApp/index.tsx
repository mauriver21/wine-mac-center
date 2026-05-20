import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  Grid,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { alpha } from '@mui/material';
import { FormSchema, useSchema } from './useSchema';
import { TextField, Checkbox, useForm, Select } from 'reactjs-shared-ui/forms';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { FilePathInput } from '@components/FilePathInput';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { WinetricksSelector } from '@components/WinetricksSelector';
import { ConfigOrigin, FileFilter, PipelineAction } from '@constants/enums';
import {
  CpuChipIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { CardItem } from '@components/CardItem';
import { ArtWorkInput } from '@components/ArtWorkInput';
import { blobToURL } from '@utils/blobToURL';
import { IconInput } from '@components/IconInput';
import { useNavigateApp } from '@hooks/useNavigateApp';

const ITEM_STYLE = { px: '20px !important' };

export const CreateApp: React.FC = () => {
  const { t } = useI18n();
  const schema = useSchema();
  const form = useForm(schema);
  const wineAppPipelineModel = useWineAppPipelineModel();
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const { navigateToAppPipeline, navigateToApps } = useNavigateApp();
  const [artworkSrc, setArtWorkSrc] = useState('');
  const [iconSrc, setIconSrc] = useState('');

  const reset = () => {
    setArtWorkSrc('');
    setIconSrc('');
    form.reset();
  };

  const modules = [
    <CardItem icon={PencilSquareIcon} label={t('applicationName')}>
      <TextField
        autoComplete="off"
        control={form.control}
        name="name"
        label={t('applicationName')}
      />
    </CardItem>,
    <CardItem icon={CpuChipIcon} label={t('wineEngine')}>
      <WineEnginesSelect fullWidth control={form.control} name="engineVersion" />
    </CardItem>,
    <CardItem icon={PlayCircleIcon} label={t('setupExecutable')}>
      <Grid container>
        <Grid item xs={9.5}>
          <Stack spacing={1.5}>
            <Select
              label={t('installBy')}
              name="installBy"
              control={form.control}
              options={[
                { value: 'executable', label: t('setupExecutableOption') },
                { value: 'folder', label: t('copyingApplicationFolder') }
              ]}
            />
            {form.watch('installBy') === 'executable' ? (
              <FilePathInput
                control={form.control}
                filters={FileFilter.WindowsExecutables}
                noSelectedFileLabel={t('selectSetupExecutable')}
                selectedFileLabel={t('changeSetupExecutable')}
                name="setupExecutablePath"
              />
            ) : (
              <></>
            )}
            {form.watch('installBy') === 'folder' ? (
              <FilePathInput
                control={form.control}
                properties={['openDirectory']}
                noSelectedFileLabel={t('selectFolderPath')}
                selectedFileLabel={t('changeFolderPath')}
                name="appFolderPath"
              />
            ) : (
              <></>
            )}
            <IconInput
              type="image"
              imgSrc={iconSrc}
              name="iconFile"
              control={form.control}
              onInput={async (file) => {
                file && setIconSrc(blobToURL(await file?.arrayBuffer()));
              }}
            />
          </Stack>
        </Grid>
        <Grid pl={2.2} item xs={2.5} justifyItems="center" justifyContent="flex-end">
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
        </Grid>
      </Grid>
    </CardItem>,
    <CardItem icon={SparklesIcon} label={t('winetricks')}>
      <Grid container>
        <Grid item xs={4}>
          <Checkbox control={form.control} name="dxvkEnabled" label={t('enableDXVK')} />
        </Grid>
        <Grid item xs={4}>
          <Checkbox control={form.control} name="useWinetricks" label={t('useWinetricks')} />
        </Grid>
        <Grid mt={1} item xs={12}>
          <WinetricksSelector
            disabled={!Boolean(form.watch('useWinetricks'))}
            control={form.control}
            name="winetricksVerbs"
            winetricksVersionSelectProps={{
              control: form.control,
              name: 'winetricksVersion'
            }}
          />
        </Grid>
      </Grid>
    </CardItem>
  ];

  const submit = async (data: FormSchema) => {
    const origin = ConfigOrigin.INSTALLED_APP;
    const {
      name,
      appFolderPath,
      artworkFile,
      iconFile,
      useWinetricks: _,
      winetricksVerbs = [],
      winetricksVersion,
      ...rest
    } = data;
    await wineAppPipelineModel.scaffoldWineApp(
      {
        appName: data.name,
        config: {
          name,
          appFolderPath,
          artworkFile: await artworkFile?.arrayBuffer(),
          iconFile: await iconFile?.arrayBuffer(),
          origin,
          winetricks: { verbs: winetricksVerbs, version: winetricksVersion },
          ...rest
        },
        origin
      },
      (appName) => navigateToAppPipeline(appName, { origin, action: PipelineAction.RUN })
    );
    reset();
  };

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
                {t('createApp')}
              </H6>
              <Button
                sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                color="secondary"
                onClick={navigateToApps}
              >
                {t('back')}
              </Button>
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
                <Button
                  sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                  color="secondary"
                  disabled={form.isInvalid()}
                  type="submit"
                >
                  {t('create')}
                </Button>
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
