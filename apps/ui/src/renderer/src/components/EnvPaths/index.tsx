import { CardItem } from '@components/CardItem';
import { useEnv } from '@hooks/useEnv';
import { Folder, TravelExplore } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { showItemInFolder } from '@utils/showItemInFolder';
import { useMemo } from 'react';
import { CardProps, Icon, Stack } from 'reactjs-shared-ui';

export interface EnvPathsProps {
  developer?: boolean;
  cardProps?: CardProps;
}

export const EnvPaths: React.FC<EnvPathsProps> = ({ developer, cardProps = {} }) => {
  const env = useEnv();
  const isDev = developer ?? (env.isDev || false);
  const envPaths = useMemo(() => {
    let envPaths: Array<{ path: string; name: string }> = [];
    for (const [key, value] of Object.entries(env.get())) {
      if (!isDev && !key.includes('WINE') && !key.includes('HOME')) {
        continue;
      }

      envPaths = [...envPaths, { path: value, name: key }];
    }

    return envPaths;
  }, [isDev]);

  const { sx: cardPropsSx, ...restCardProps } = cardProps;

  return (
    <CardItem
      cardProps={{ sx: { overflow: 'auto', ...cardPropsSx }, ...restCardProps }}
      icon={TravelExplore}
      label="Environment Paths"
    >
      <Stack spacing={2}>
        {envPaths.map(({ name, path }, index) => (
          <TextField
            key={index}
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
