import React, { useEffect, useState } from 'react';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { SteamCliDeveloper } from '@components/SteamCliDeveloper';
import { CardItem } from '@components/CardItem';
import { useLocalState } from '@hooks/useLocalState';
import { useSteamCli } from '@hooks/useSteamCli';
import { useAppModel } from '@models/useAppModel';
import { TextField, TextFieldProps } from '@mui/material';
import { Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { useConfigLayout } from '@hooks/useConfigLayout';

export interface SteamCredentialsProps {
  developer?: boolean;
}

export const SteamCredentials: React.FC<SteamCredentialsProps> = ({ developer }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const steamCli = useSteamCli();
  const appModel = useAppModel();
  const { getState, setState } = useLocalState('steamCredentials');
  const onChangeSteamCredentials: TextFieldProps['onChange'] = ({
    currentTarget: { name, value }
  }) => {
    setState({ ...getState(), [name]: value });
  };
  const { setLoading } = useConfigLayout();

  const steamLogin = async () => {
    setLoggingIn(true);
    const { userName = '', password = '' } = getState() || {};
    try {
      await steamCli.login({ userName, password });
      appModel.dispatchSuccessMessage('Login Success');
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    setLoading(loggingIn);
  }, [loggingIn]);

  useEffect(() => {
    return () => {
      steamCli.refresh();
    };
  }, []);

  return (
    <CardItem icon={SteamIcon} label="Steam Credentials">
      <Stack spacing={2}>
        <Stack spacing={2}>
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.userName}
            autoComplete="off"
            name="userName"
            label="User Name"
          />
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.password}
            autoComplete="off"
            name="password"
            type="password"
            label="Password"
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button disabled={loggingIn} onClick={steamLogin}>
            Check Login
          </Button>
        </Stack>
        {developer && <SteamCliDeveloper />}
      </Stack>
    </CardItem>
  );
};
