import { useMemo, useState } from 'react';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { createSteamCli } from '@utils/createSteamCli';
import { TextField, TextFieldProps } from '@mui/material';

export const SteamCli: React.FC = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const steamCli = useMemo(() => createSteamCli({ credentials }), [credentials]);

  const onChange: TextFieldProps['onChange'] = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  steamCli;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>SteamCli</H6>
          <TextField
            label="User Name"
            name="userName"
            value={credentials.userName}
            onChange={onChange}
          />
          <TextField
            label="Password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            type="password"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
