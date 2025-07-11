import { Body1, Box, Button, Dialog, DialogProps, Grid, Stack } from 'reactjs-ui-core';
import { TextField, Checkbox, useForm } from 'reactjs-ui-form-fields';
import { v4 as uuid } from 'uuid';
import { FormSchema, useSchema } from './useSchema';
import { FilePathInput } from '@components/FilePathInput';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { FileInput } from '@components/FileInput';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { WinetricksSelector } from '@components/WinetricksSelector';
import { FileFilter } from '@constants/enums';

export interface AppConfigDialogProps extends DialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppConfigDialog: React.FC<AppConfigDialogProps> = ({ setOpen, ...rest }) => {
  const schema = useSchema();
  const form = useForm(schema);
  const wineAppPipelineModel = useWineAppPipelineModel();

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
    setOpen(false);
  };

  return (
    <Dialog disableEscapeKeyDown disableBackdropClick fullWidth maxWidth="md" {...rest}>
      <form onSubmit={form.handleSubmit(submit as any)} style={{ display: 'contents' }}>
        <Stack p={2} spacing={2} bgcolor="secondary.main">
          <Body1 fontWeight={500}>Create Application</Body1>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  control={form.control}
                  name="name"
                  label="Application Name"
                />
              </Grid>
              <Grid item xs={12}>
                <WineEnginesSelect control={form.control} name="engineVersion" />
              </Grid>
              <Grid item xs={6}>
                <FileInput
                  noSelectedFileLabel="Select Artwork"
                  selectedFileLabel="Change Artwork"
                  control={form.control}
                  name="artworkFile"
                  filters={FileFilter.Images}
                />
              </Grid>
              <Grid item xs={6}>
                <FileInput
                  noSelectedFileLabel="Select Icon"
                  selectedFileLabel="Change Icon"
                  control={form.control}
                  name="iconFile"
                  filters={FileFilter.Images}
                />
              </Grid>
              <Grid item xs={12}>
                <FilePathInput
                  noSelectedFileLabel="Select Setup Executable"
                  selectedFileLabel="Change Setup Executable"
                  control={form.control}
                  name="setupExecutablePath"
                  filters={FileFilter.WindowsExecutables}
                />
              </Grid>
              <Grid item xs={4}>
                <Checkbox control={form.control} name="dxvkEnabled" label="Enable DXVK" />
              </Grid>
              <Grid item xs={4}>
                <Checkbox control={form.control} name="useWinetricks" label="Winetricks" />
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
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button color="primary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={form.isInvalid()} type="submit" color="primary">
              Create
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
};
