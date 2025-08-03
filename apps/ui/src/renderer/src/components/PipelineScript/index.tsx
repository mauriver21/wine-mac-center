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
} from 'reactjs-ui-core';
import { alpha } from '@mui/material';
import { FormSchema, useSchema } from './useSchema';
import { TextField, Checkbox, useForm, Select } from 'reactjs-ui-form-fields';
import { useFieldArray } from 'react-hook-form';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { WinetricksSelector } from '@components/WinetricksSelector';
import {
  CpuChipIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { CardItem } from '@components/CardItem';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { getHiphenatedString } from '@utils/getHiphenatedString';
import { useWineScriptApiClient } from '@api-clients/useWineScriptApiClient';
import { ScriptOperation } from '@constants/enums';

const ITEM_STYLE = { px: '20px !important' };

export const PipelineScript: React.FC = () => {
  const schema = useSchema();
  const form = useForm(schema);
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const { navigateToScripts } = useNavigateApp();
  const wineScriptApiClient = useWineScriptApiClient();
  const [loading, setLoading] = useState(false);
  const { fields } = useFieldArray<FormSchema>({
    name: 'pipelineScripts',
    control: form.control
  });

  const modules = [
    <CardItem icon={PencilSquareIcon} label="Script Details">
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          control={form.control}
          name="appName"
          label="Application Name"
        />
        <Select
          label="Version"
          name="version"
          control={form.control}
          options={[
            { value: 'steam', label: 'Steam' },
            { value: 'gog', label: 'GOG' },
            { value: 'standalone', label: 'Standalone' }
          ]}
        />
        <TextField
          InputProps={{ disabled: true }}
          autoComplete="off"
          control={form.control}
          name="appConfigId"
          label="App Config Id"
        />
        <TextField
          InputProps={{ disabled: true }}
          autoComplete="off"
          control={form.control}
          name="keyName"
          label="Key Name"
          value={getHiphenatedString(form.watch('appName')).toLowerCase()}
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
    <CardItem icon={PlayCircleIcon} label="Installation Script">
      <Stack>
        {fields.map((_, index) => (
          <Stack key={index} spacing={2}>
            <Select
              label="Operation"
              control={form.control}
              name={`pipelineScripts.${index}.operation`}
              options={[
                { value: ScriptOperation.DOWNLOAD, label: 'Download File' },
                { value: ScriptOperation.COPY, label: 'Copy' },
                { value: ScriptOperation.REMOVE, label: 'Remove' },
                { value: ScriptOperation.RUN_WINDOWS_EXE, label: 'Run Windows EXE' },
                { value: ScriptOperation.DECOMPRESS, label: 'Decompress' }
              ]}
            />
            <TextField label="File URL" />
          </Stack>
        ))}
      </Stack>
    </CardItem>
  ];

  const submit = async (data: FormSchema) => {
    setLoading(true);
    await wineScriptApiClient.create(data);
    setLoading(false);
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
                Create Script
              </H6>
              <Button
                sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                color="secondary"
                onClick={navigateToScripts}
              >
                Back
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
                  disabled={loading || form.isInvalid()}
                  type="submit"
                >
                  Create
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
