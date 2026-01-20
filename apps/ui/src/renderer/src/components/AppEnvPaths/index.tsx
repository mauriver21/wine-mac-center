import { CardItem } from '@components/CardItem';
import { useAppConfigContext } from '@hooks/useAppConfigContext';
import { TravelExplore } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useMemo } from 'react';
import { Stack } from 'reactjs-shared-ui';

export const AppEnvPaths: React.FC = () => {
  const { wineApp } = useAppConfigContext() || {};
  const envPaths = useMemo(() => {
    let envPaths: Array<{ path: string; name: string }> = [];
    for (const [key, value] of Object.entries(wineApp?.getWineEnv() || {})) {
      envPaths = [...envPaths, { path: value, name: key }];
    }

    return envPaths;
  }, [wineApp]);

  return (
    <CardItem
      cardProps={{ sx: { overflow: 'auto' } }}
      icon={TravelExplore}
      label="Environment Paths"
    >
      <Stack spacing={2}>
        {envPaths.map(({ name, path }) => (
          <TextField
            InputProps={{
              readOnly: true,
              sx: { bgcolor: 'secondary.main' }
            }}
            label={name}
            value={path}
          />
        ))}
      </Stack>
    </CardItem>
  );
};
