import { Button } from '@components/Button';
import { FilePathInput, FilePathInputProps } from '@components/FilePathInput';
import { TrashIcon } from '@heroicons/react/24/solid';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { Chip, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ExecutablesSelectorProps {
  name?: string;
  value?: WineAppExecutable[];
  filePathInputProps?: FilePathInputProps;
}

export const DEFAULT_EXECUTABLE = { path: '', main: false, flags: '' } as const;
export const ExecutablesSelector: React.FC<ExecutablesSelectorProps> = ({
  name = '',
  value,
  filePathInputProps
}) => {
  const { t } = useI18n();
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

  useEffect(() => {
    value !== undefined && setExecutables(value);
  }, [value]);

  return (
    <Stack spacing={2}>
      {executables?.map((item, index) => (
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
              value={item.path}
              name={`${name}.${index}.path`}
            />
            <TextField value={item.flags} label={t('exeFlags')} name={`${name}.${index}.flags`} />
          </Stack>
        </Box>
      ))}
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={insert}>{t('addExecutable')}</Button>
      </Stack>
    </Stack>
  );
};
