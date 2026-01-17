import React, { useState } from 'react';
import { Button } from '@components/Button';
import { DialogProps, Dialog, Stack, Body1, Icon, H5 } from 'reactjs-shared-ui';
import { TextField } from '@mui/material';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';

export interface SteamGuardCodeDialogProps extends DialogProps {
  loading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept: (guardCode: string) => void;
  onCancel: (eventName: 'CANCELED') => void;
}

export const SteamGuardCodeDialog: React.FC<SteamGuardCodeDialogProps> = ({
  setOpen,
  disableEscapeKeyDown,
  disableBackdropClick,
  loading,
  onAccept,
  onCancel,
  ...rest
}) => {
  const [guardCode, setGuardCode] = useState('');

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      fullWidth
      onClose={close}
      {...rest}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        bgcolor="secondary.main"
        p={2}
        spacing={2}
      >
        <Stack spacing={3} pb={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon render={SteamIcon} size={48} />
            <H5 color="text.secondary" fontWeight={500}>
              Steam Guard
            </H5>
          </Stack>
          <Body1 fontWeight={500}>
            It looks like you’re trying to sign in from a new device. Please check your email and
            enter the Steam Guard code to access your account.
          </Body1>
          <TextField label="Guard Code" onChange={(event) => setGuardCode(event.target.value)} />
        </Stack>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            disabled={loading}
            onClick={() => {
              onCancel('CANCELED');
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              onAccept(guardCode);
              setOpen(false);
            }}
          >
            Accept
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
