import { useEffect, useState } from 'react';
import { Box, Button } from 'reactjs-shared-ui';
import { Field, TextField, TextFieldProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { InputAdornment } from '@mui/material';
import { showOpenDialog } from '@utils/showOpenDialog';
import { getRelativeDriveCPath } from '@utils/getRelativeDriveCPath';

export type FilePathInputProps = Omit<
  TextFieldProps,
  'type' | 'label' | 'accept' | 'onInput' | 'onChange'
> & {
  noSelectedFileLabel?: string;
  selectedFileLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  dialogText?: string;
  properties?: Electron.OpenDialogOptions['properties'];
  defaultPath?: Electron.OpenDialogOptions['defaultPath'];
  relativeToDriveC?: boolean;
  onInput?: (path: string) => void;
};

export const FilePathInput: React.FC<FilePathInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value,
  noSelectedFileLabel,
  selectedFileLabel,
  dialogText,
  filters,
  properties,
  defaultPath,
  relativeToDriveC,
  ...rest
}) => {
  const { t } = useI18n();
  const [filePath, setFilePath] = useState('');

  const selectFile = async () => {
    const result = await showOpenDialog({
      title: dialogText || t('selectFile'),
      filters,
      properties,
      defaultPath
    });

    return result.filePaths;
  };

  useEffect(() => {
    setFilePath(value);
  }, [value]);

  return (
    <Field
      control={control}
      fieldOptions={fieldOptions}
      as="input"
      name={name}
      render={({ props: { onInput, ...props }, helpers }) => (
        <>
          <TextField
            fullWidth
            {...rest}
            {...props}
            value={filePath}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Box pr={2}>
                    <Button
                      sx={{ border: (theme) => `1px solid ${theme.palette.secondary.light}` }}
                      color="secondary"
                      type="button"
                    >
                      {filePath
                        ? selectedFileLabel || t('changeFile')
                        : noSelectedFileLabel || t('selectFileButton')}
                    </Button>
                  </Box>
                </InputAdornment>
              )
            }}
            onClick={async () => {
              let [filePath] = await selectFile();
              if (relativeToDriveC) filePath = getRelativeDriveCPath(filePath);
              setFilePath(filePath);
              onInput({ target: { value: filePath } });
              onInputProp?.(filePath);
            }}
            error={helpers.error}
          />
        </>
      )}
    />
  );
};
