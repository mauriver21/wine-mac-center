import React, { useEffect, useLayoutEffect } from 'react';
import { Button } from '@components/Button';
import { Box, FormControlLabel, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { Checkbox, Chip, Divider } from '@mui/material';
import { TextField } from 'reactjs-shared-ui/forms';
import { DRIVE_C_PATH } from '@constants/paths';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Executable } from '@interfaces/Executable';

export interface ScriptExecutablesSelectorProps {
  baseName: string;
  form: UseFormReturn<any>;
}

const DEFAULT_EXECUTABLE = { path: '', main: true, flags: '' } as const;
export const ScriptExecutablesSelector: React.FC<ScriptExecutablesSelectorProps> = ({
  baseName: baseNameProp,
  form
}) => {
  const { t } = useI18n();
  const {
    fields: baseFields,
    append,
    update,
    remove
  } = useFieldArray({
    name: baseNameProp,
    control: form.control
  });
  const fields = baseFields as unknown as Executable[];

  useEffect(() => {
    const hasMain = fields.some((item) => item.main);
    if (!hasMain) {
      update(0, { ...fields[0], main: true });
    }
  }, [fields.length]);

  useLayoutEffect(() => {
    !fields.length && append(DEFAULT_EXECUTABLE);
  }, []);

  return (
    <Stack
      bgcolor="secondary.main"
      spacing={2}
      overflow="auto"
      maxHeight={400}
      borderRadius={2}
      p={3}
    >
      {fields?.map((_, index) => {
        const field = fields.find((_, i) => i == index);
        const baseName = `${baseNameProp}.${index}`;
        const path = form.watch(`${baseName}.path`);
        const executableName = path?.match?.(/[^/]+\.exe$/i)?.[0];

        return (
          <Box
            border="secondary.light"
            bgcolor="secondary.main"
            key={index}
            position="relative"
            borderRadius={2}
            pt={5}
            sx={{ '&:hover .exe-actions': { display: 'flex' } }}
          >
            <Box position="absolute" top={-7} left={0}>
              <Chip
                sx={{ opacity: 1, bgcolor: 'secondary.light' }}
                label={executableName || `${t('executable', { number: index + 1 })}`}
              />
            </Box>
            <Box
              className="exe-actions"
              sx={{ display: 'none' }}
              position="absolute"
              top={-7}
              right={0}
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
                control={form.control}
                label={t('executablePath')}
                placeholder={t('relativePathExample')}
              />
              <TextField control={form.control} name={`${baseName}.flags`} label={t('exeFlags')} />
              <FormControlLabel
                label={t('setMainExe')}
                control={
                  <Checkbox
                    checked={field?.main}
                    color="success"
                    disableRipple
                    onChange={() => {
                      for (let i = 0; i < fields.length; i++) {
                        if (i !== index) {
                          update(i, { ...field, main: false });
                        }
                      }
                      update(index, { ...field, main: true });
                    }}
                  />
                }
              />
            </Stack>
            <Divider sx={{ my: 2 }} />
          </Box>
        );
      })}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          onClick={() => {
            append({ ...DEFAULT_EXECUTABLE, main: false });
          }}
        >
          {t('addExecutable')}
        </Button>
      </Stack>
    </Stack>
  );
};
