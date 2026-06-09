import { IconButton } from '@components/IconButton';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { alpha } from '@mui/material';
import { Body2, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ExecutableProps {
  executable: WineAppExecutable;
}

export const Executable: React.FC<ExecutableProps> = ({ executable }) => {
  const { wineApp } = useWineAppContext();
  const { t } = useI18n();
  return (
    <Stack
      sx={{
        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.9),
        borderRadius: 2,
        p: 2
      }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Body2>{executable.path}</Body2>
      <IconButton
        sx={{ border: 1 }}
        title={t('run')}
        onClick={async () => {
          wineApp?.runExe?.({ path: executable.path, flags: executable.flags });
        }}
      >
        <Icon render={PlayIcon} />
      </IconButton>
    </Stack>
  );
};
