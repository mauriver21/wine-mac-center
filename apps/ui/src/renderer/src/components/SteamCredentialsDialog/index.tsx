import React, { useState } from 'react';
import { Button } from '@components/Button';
import { DialogProps, Dialog, Stack, Icon, H5 } from 'reactjs-shared-ui';
import { TextField, TextFieldProps } from '@mui/material';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { EventName } from '@constants/enums';
import { useLocalState } from '@hooks/useLocalState';

export interface SteamCredentialsDialogProps extends DialogProps {
  loading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept: (credentials: SteamCredentials) => void;
  onCancel: (eventName: EventName.Cancelled) => void;
}

export const SteamCredentialsDialog: React.FC<SteamCredentialsDialogProps> = ({
  setOpen,
  disableEscapeKeyDown,
  disableBackdropClick,
  loading,
  onAccept,
  onCancel,
  ...rest
}) => {
  const { getState } = useLocalState('steamCredentials');
  const [credentials, setCredentials] = useState<SteamCredentials>({
    userName: '',
    password: '',
    ...getState()
  });

  const onChangeCredentials: TextFieldProps['onChange'] = ({ currentTarget: { name, value } }) => {
    setCredentials({ ...credentials, [name]: value });
  };

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
              Steam Credentials
            </H5>
          </Stack>
          <TextField
            name="userName"
            value={credentials.userName}
            label="User Name"
            onChange={onChangeCredentials}
          />
          <TextField
            name="password"
            value={credentials.password}
            label="Password"
            type="password"
            onChange={onChangeCredentials}
          />
        </Stack>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            disabled={loading}
            onClick={() => {
              onCancel(EventName.Cancelled);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              onAccept(credentials);
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
