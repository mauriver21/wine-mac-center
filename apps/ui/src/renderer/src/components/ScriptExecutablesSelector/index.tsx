import React, { useLayoutEffect } from 'react';
import { Button } from '@components/Button';
import { Box, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { Chip } from '@mui/material';
import { Checkbox, FieldProps, TextField } from 'reactjs-shared-ui/forms';
import { DRIVE_C_PATH } from '@constants/paths';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useFieldArray } from 'react-hook-form';

export interface ScriptExecutablesSelectorProps extends FieldProps {
  baseName: string;
}

export const DEFAULT_EXECUTABLE = { path: '', main: true, flags: '' } as const;
export const ScriptExecutablesSelector: React.FC<ScriptExecutablesSelectorProps> = ({
  control,
  baseName: baseNameProp
}) => {
  const { t } = useI18n();
  const { fields, append, remove } = useFieldArray({
    name: baseNameProp,
    control
  });

  useLayoutEffect(() => {
    !fields.length && append(DEFAULT_EXECUTABLE);
  }, []);

  return (
    <Stack spacing={2}>
      {fields?.map((_, index) => {
        const baseName = `${baseNameProp}.${index}`;
        return (
          <Box
            key={index}
            position="relative"
            bgcolor="secondary.dark"
            borderRadius={2}
            pt={5}
            sx={{ '&:hover .exe-actions': { display: 'flex' } }}
          >
            <Box position="absolute" top={-7} left={0}>
              <Chip
                sx={{ opacity: 1, bgcolor: 'secondary.light' }}
                label={t('executable', { number: index + 1 })}
              />
            </Box>
            <Box
              className="exe-actions"
              sx={{ display: 'none' }}
              position="absolute"
              top={-7}
              left={-15}
            >
              {fields.length > 1 && (
                <Button
                  variant="contained"
                  sx={{ borderRadius: 10 }}
                  equalSize={32}
                  title={t('removeExecutable')}
                  onClick={() => remove(index)}
                >
                  <Icon strokeWidth={3} render={TrashIcon} />
                </Button>
              )}
            </Box>
            <Stack spacing={2}>
              <TextField
                InputProps={{
                  startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
                }}
                name={`${baseName}.path`}
                control={control}
                label={t('executablePath')}
                placeholder={t('relativePathExample')}
              />
              <TextField control={control} name={`${baseName}.flags`} label={t('exeFlags')} />
              <Checkbox
                control={control}
                name={`${baseName}.main`}
                color="success"
                label={t('setAsMainExecutable')}
                disableRipple
              />
            </Stack>
          </Box>
        );
      })}
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={() => append(DEFAULT_EXECUTABLE)}>{t('addExecutable')}</Button>
      </Stack>
    </Stack>
  );
};
