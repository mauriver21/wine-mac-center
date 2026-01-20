import { CardItem } from '@components/CardItem';
import { useEnv } from '@hooks/useEnv';
import { Folder, TravelExplore } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { showItemInFolder } from '@utils/showItemInFolder';
import { useMemo } from 'react';
import { Icon, Stack } from 'reactjs-shared-ui';

export interface EnvPathsProps {
  developer?: boolean;
}

export const EnvPaths: React.FC<EnvPathsProps> = ({ developer = false }) => {
  const env = useEnv();
  const envPaths = useMemo(() => {
    let envPaths: Array<{ path: string; name: string }> = [];
    for (const [key, value] of Object.entries(env.get())) {
      if (!developer && !key.includes('WINE') && !key.includes('HOME')) {
        continue;
      }

      envPaths = [...envPaths, { path: value, name: key }];
    }

    return envPaths;
  }, []);

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
              sx: { bgcolor: 'secondary.main' },
              endAdornment: (
                <IconButton title="Open Location" onClick={() => showItemInFolder(path)}>
                  <Icon render={Folder} />
                </IconButton>
              )
            }}
            label={name}
            value={path}
          />
        ))}
      </Stack>
    </CardItem>
  );
};
