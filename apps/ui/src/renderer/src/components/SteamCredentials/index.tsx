import React, { useEffect, useState } from 'react';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { SteamCliDeveloper } from '@components/SteamCliDeveloper';
import { CardItem } from '@components/CardItem';
import { useLocalState } from '@hooks/useLocalState';
import { useSteamCli } from '@hooks/useSteamCli';
import { useAppModel } from '@models/useAppModel';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { TextField, TextFieldProps } from '@mui/material';
import { Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { spawnLog } from '@utils/spawnLog';

export interface SteamCredentialsProps {
  developer?: boolean;
}

export const SteamCredentials: React.FC<SteamCredentialsProps> = ({ developer }) => {
  const { t } = useI18n();
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
      await steamCli.login({ userName, password }, spawnLog);
      appModel.dispatchSuccessMessage(t('loginSuccess'));
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
    <CardItem icon={SteamIcon} label={t('steamCredentials')}>
      <Stack spacing={2}>
        <Stack spacing={2}>
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.userName}
            autoComplete="off"
            name="userName"
            label={t('userName')}
          />
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.password}
            autoComplete="off"
            name="password"
            type="password"
            label={t('password')}
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button disabled={loggingIn} onClick={steamLogin}>
            {t('checkLogin')}
          </Button>
        </Stack>
        {developer && <SteamCliDeveloper />}
      </Stack>
    </CardItem>
  );
};
