import { Button } from '@components/Button';
import { FilePathInput, FilePathInputProps } from '@components/FilePathInput';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { Chip, TextField } from '@mui/material';
import { spawnLog } from '@utils/spawnLog';
import { useEffect, useRef, useState } from 'react';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ExecutablesSelectorProps {
  value?: WineAppExecutable[];
  filePathInputProps?: Pick<FilePathInputProps, 'defaultPath' | 'relativeToDriveC'>;
  onChange?: (executables: WineAppExecutable[]) => void;
  hideRunExeButton?: boolean;
}

export const DEFAULT_EXECUTABLE = { path: '', main: false, flags: '' } as const;
export const ExecutablesSelector: React.FC<ExecutablesSelectorProps> = ({
  value,
  filePathInputProps,
  onChange,
  hideRunExeButton
}) => {
  const { t } = useI18n();
  const { wineApp } = useWineAppContext() || {};
  const ref = useRef({ mounted: false });
  const [executables, setExecutables] = useState<WineAppExecutable[]>([]);

  const insert = () => {
    setExecutables((prev) => {
      const executables = [...(prev || []), DEFAULT_EXECUTABLE];
      return executables;
    });
  };

  const remove = (index: number) => {
    setExecutables((prev) => {
      const executables = prev?.filter((_, i) => index !== i);
      return executables;
    });
  };

  const save = (data: Partial<WineAppExecutable>) => {
    setExecutables((prev) => {
      return prev.map((item) => {
        if (item.path == data.path) {
          return { ...item, ...data };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    value !== undefined && setExecutables(value);
  }, [value]);

  useEffect(() => {
    ref.current.mounted && onChange?.(executables);
  }, [executables]);

  useEffect(() => {
    ref.current.mounted = true;
  }, []);

  return (
    <Stack spacing={2}>
      {executables?.map((executable, index) => (
        <Box
          position="relative"
          key={index}
          bgcolor="secondary.dark"
          p={2}
          borderRadius={2}
          pt={5}
          sx={{ '&:hover .exe-actions': { display: 'flex' } }}
        >
          <Box position="absolute" top={-7} left={20}>
            <Chip sx={{ opacity: 1 }} label={t('executable', { number: index + 1 })} />
          </Box>
          <Box
            className="exe-actions"
            sx={{ display: 'none' }}
            position="absolute"
            top={-7}
            left={-15}
          >
            {executables.length > 1 ? (
              <Button
                variant="contained"
                sx={{ borderRadius: 10 }}
                equalSize={32}
                onClick={() => {
                  remove(index);
                }}
                title={t('removeExecutable')}
              >
                <Icon strokeWidth={3} render={TrashIcon} />
              </Button>
            ) : (
              <></>
            )}
          </Box>
          <Stack key={index} spacing={2}>
            <FilePathInput
              {...filePathInputProps}
              value={executable.path}
              onInput={(path) => {
                save({ path });
              }}
            />
            <TextField
              label={t('exeFlags')}
              value={executable.flags}
              onChange={(event) => {
                save({ flags: event.target.value });
              }}
            />
            {hideRunExeButton ? (
              <></>
            ) : (
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  onClick={() => {
                    wineApp?.runExe({ path: executable.path, flags: executable.flags }, spawnLog);
                  }}
                >
                  {t('runExecutable')}
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      ))}
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={insert}>{t('addExecutable')}</Button>
      </Stack>
    </Stack>
  );
};
