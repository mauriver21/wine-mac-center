import { Button } from '@components/Button';
import { FilePathInput } from '@components/FilePathInput';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { Chip, TextField } from '@mui/material';
import { spawnLog } from '@utils/spawnLog';
import { useState } from 'react';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ExecutableItemProps {
  index?: number;
  hideRemoveAction?: boolean;
  removeAction?: (index: number) => void;
  executable?: WineAppExecutable;
  onChange?: (executable: Partial<WineAppExecutable>) => void;
  hideRunExeButton?: boolean;
}

export const ExecutableItem: React.FC<ExecutableItemProps> = ({
  index = 0,
  hideRemoveAction = false,
  removeAction,
  executable,
  onChange,
  hideRunExeButton
}) => {
  const { t } = useI18n();
  const { wineApp } = useWineAppContext() || {};
  const [loading, setLoading] = useState(false);

  return (
    <Box
      position="relative"
      bgcolor="secondary.dark"
      p={2}
      borderRadius={2}
      pt={5}
      sx={{ '&:hover .exe-actions': { display: 'flex' } }}
    >
      <Box position="absolute" top={-7} left={20}>
        <Chip sx={{ opacity: 1 }} label={t('executable', { number: index + 1 })} />
      </Box>
      <Box className="exe-actions" sx={{ display: 'none' }} position="absolute" top={-7} left={-15}>
        {!hideRemoveAction && (
          <Button
            disabled={loading}
            variant="contained"
            sx={{ borderRadius: 10 }}
            equalSize={32}
            onClick={() => {
              removeAction?.(index);
            }}
            title={t('removeExecutable')}
          >
            <Icon strokeWidth={3} render={TrashIcon} />
          </Button>
        )}
      </Box>
      <Stack spacing={2}>
        <FilePathInput
          defaultPath={wineApp?.getWineEnv()?.WINE_APP_DRIVE_C_PATH}
          relativeToDriveC
          value={executable?.path}
          onInput={(path) => {
            onChange?.({ path });
          }}
        />
        <TextField
          label={t('exeFlags')}
          value={executable?.flags}
          onChange={(event) => {
            onChange?.({ flags: event.target.value });
          }}
        />
        {hideRunExeButton ? (
          <></>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Button
              disabled={!Boolean(executable?.path) || loading}
              onClick={async () => {
                if (executable?.path) {
                  setLoading(true);
                  await wineApp?.runExe(
                    { path: executable.path, flags: executable?.flags },
                    spawnLog
                  );
                  setLoading(false);
                }
              }}
            >
              {t('runExecutable')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
