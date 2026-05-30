import React, { useEffect } from 'react';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { SteamCliDeveloper } from '@components/SteamCliDeveloper';
import { CardItem } from '@components/CardItem';
import { useLocalState } from '@hooks/useLocalState';
import { useSteamCli } from '@hooks/useSteamCli';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { TextField, TextFieldProps } from '@mui/material';
import { Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { spawnLog } from '@utils/spawnLog';

export interface SteamCredentialsProps {
  developer?: boolean;
}

export const SteamCredentials: React.FC<SteamCredentialsProps> = ({ developer }) => {
  const { t } = useI18n();
  const steamCli = useSteamCli();
  const { getState, setState } = useLocalState('steamCredentials');
  const onChangeSteamCredentials: TextFieldProps['onChange'] = ({
    currentTarget: { name, value }
  }) => {
    setState({ ...getState(), [name]: value });
  };

  const steamLogin = async () => {
    const { userName = '', password = '' } = getState() || {};
    steamCli.login({ userName, password }, spawnLog);
  };

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
          <Button onClick={steamLogin}>{t('checkLogin')}</Button>
        </Stack>
        {developer && <SteamCliDeveloper />}
      </Stack>
    </CardItem>
  );
};
