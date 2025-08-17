import { useState } from 'react';
import { Body1, Body2, Button, Dialog, DialogProps, Stack } from 'reactjs-shared-ui';
import { useForm } from 'reactjs-shared-ui/forms';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { ExitCode } from '@constants/enums';
import { WineApp } from '@interfaces/WineApp';
import { handleError } from '@utils/handleError';
import { FormSchema, useSchema } from './useSchema';

export interface ChangeWineEngineDialogProps extends DialogProps {
  wineApp: WineApp | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChangeWineEngineDialog: React.FC<ChangeWineEngineDialogProps> = ({
  wineApp,
  setOpen,
  ...rest
}) => {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const schema = useSchema();
  const form = useForm(schema);
  const config = wineApp?.getAppConfig();

  const submit = async (data: FormSchema) => {
    try {
      setRunning(true);
      setError('');

      setMessage(`Extracting Wine Engine ${data.engineVersion}`);

      await new Promise((resolve, reject) => {
        wineApp?.extractEngine(data.engineVersion, {
          onStdOut: console.log,
          onStdErr: console.log,
          onExit: (output) => {
            if (output === ExitCode.Error) {
              reject(`Failed to Extract the Wine Engine ${data.engineVersion}`);
            }
            resolve(undefined);
          }
        });
      });

      setMessage(`Initializing Wine Engine ${data.engineVersion}`);

      await new Promise((resolve, reject) => {
        wineApp?.wineboot('', {
          onStdOut: console.log,
          onStdErr: console.log,
          onExit: (output) => {
            if (output === ExitCode.Error) {
              reject(`Failed to initialize the Wine Engine ${data.engineVersion}`);
            }
            resolve(undefined);
          }
        });
      });

      setRunning(false);
    } catch (error) {
      setError(handleError(error));
    }
  };

  const closeErrorMessage = () => {
    setError('');
    setRunning(false);
  };

  const close = () => setOpen(false);

  return (
    <Dialog
      disableBackdropClick={running}
      disableEscapeKeyDown={running}
      fullWidth
      maxWidth="sm"
      {...rest}
    >
      <Stack justifyContent="center" bgcolor="secondary.main" minHeight={200} p={2}>
        {!running ? (
          <form onSubmit={form.handleSubmit(submit as any)} style={{ display: 'contents' }}>
            <Stack spacing={2}>
              <Body1 fontWeight={500}>Change Wine Engine</Body1>
              <WineEnginesSelect
                value={config?.engineVersion}
                control={form.control}
                name="engineVersion"
              />
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button type="submit" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.isInvalid()}>
                  Change
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <Stack spacing={2} bgcolor="secondary.main">
            {error ? (
              <Stack>
                <Body2>{error}...</Body2>
                <Button onClick={closeErrorMessage}>Close</Button>
              </Stack>
            ) : (
              <>
                <Body2>{message}...</Body2>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
};
