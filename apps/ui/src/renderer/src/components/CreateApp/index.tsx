import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  Grid,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-ui-core';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material';
import { FormSchema, useSchema } from './useSchema';
import { TextField, Checkbox, useForm } from 'reactjs-ui-form-fields';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { FilePathInput } from '@components/FilePathInput';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { WinetricksSelector } from '@components/WinetricksSelector';
import { FileFilter } from '@constants/enums';
import { CpuChipIcon, PencilSquareIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { CreateAppCardItem } from '@components/CreateAppCardItem';
import { ArtWorkInput } from '@components/ArtWorkInput';
import { blobToURL } from '@utils/blobToURL';
import { IconInput } from '@components/IconInput';

const ITEM_STYLE = { px: '20px !important' };

export const CreateApp: React.FC = () => {
  const schema = useSchema();
  const form = useForm(schema);
  const wineAppPipelineModel = useWineAppPipelineModel();
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const navigate = useNavigate();
  const [artworkSrc, setArtWorkSrc] = useState('');
  const [iconSrc, setIconSrc] = useState('');

  const modules = [
    <CreateAppCardItem icon={PencilSquareIcon} label="Application Name">
      <TextField autoComplete="off" control={form.control} name="name" label="Application Name" />
    </CreateAppCardItem>,
    <CreateAppCardItem icon={CpuChipIcon} label="Wine Engine">
      <WineEnginesSelect fullWidth control={form.control} name="engineVersion" />
    </CreateAppCardItem>,
    <CreateAppCardItem icon={PlayCircleIcon} label="Setup Executable">
      <Grid container>
        <Grid item xs={9.5}>
          <Stack spacing={1.5}>
            <FilePathInput
              control={form.control}
              filters={FileFilter.WindowsExecutables}
              noSelectedFileLabel="Select Setup Executable"
              selectedFileLabel="Change Setup Executable"
              name="setupExecutablePath"
            />
            {/* <TextField label="Exe flags" /> */}
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
            realAppName={'No Artwork'}
            onInput={async (file) => {
              file && setArtWorkSrc(blobToURL(await file?.arrayBuffer()));
            }}
          />
        </Grid>
      </Grid>
    </CreateAppCardItem>
  ];

  const submit = async (data: FormSchema) => {
    const {
      name,
      dxvkEnabled,
      engineVersion,
      setupExecutablePath,
      useWinetricks,
      winetricksVerbs
    } = data;
    wineAppPipelineModel.runWineAppPipeline({
      id: uuid(),
      name,
      dxvkEnabled,
      engineVersion,
      setupExecutablePath,
      iconFile: await data.iconFile?.arrayBuffer(),
      artworkFile: await data.artworkFile?.arrayBuffer(),
      winetricks: useWinetricks ? { verbs: [...(winetricksVerbs || [])] } : undefined
    });
    form.reset();
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
                Create App
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
                <Box
                  width="100%"
                  maxWidth={800}
                  pt={2}
                  sx={ITEM_STYLE}
                  className={ContentsClass.Item}
                >
                  <Card>
                    <CardContent>
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12}></Grid>
                          <Grid item xs={4}>
                            <Checkbox
                              control={form.control}
                              name="dxvkEnabled"
                              label="Enable DXVK"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Checkbox
                              control={form.control}
                              name="useWinetricks"
                              label="Winetricks"
                            />
                          </Grid>
                          {form.watch('useWinetricks') ? (
                            <Grid item xs={12}>
                              <WinetricksSelector control={form.control} name="winetricksVerbs" />
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            </Box>
            <Box borderLeft={(theme) => `1px solid ${theme.palette.primary.main}`}>
              <TableOfContents pt={1} />
            </Box>
          </Box>
        </ContentsArea>
      </Box>
    </form>
  );
};
