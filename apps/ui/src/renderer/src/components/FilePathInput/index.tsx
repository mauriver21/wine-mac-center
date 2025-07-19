import { useState } from 'react';
import { Box, Button, TextField } from 'reactjs-ui-core';
import { Field, TextFieldProps } from 'reactjs-ui-form-fields';
import { InputAdornment } from '@mui/material';
import { showOpenDialog } from '@utils/showOpenDialog';

export type FilePathInputProps = Omit<TextFieldProps, 'type' | 'label' | 'accept'> & {
  noSelectedFileLabel?: string;
  selectedFileLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  dialogText?: string;
};

export const FilePathInput: React.FC<FilePathInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value: _,
  noSelectedFileLabel,
  selectedFileLabel,
  dialogText = 'Select file',
  filters,
  ...rest
}) => {
  const [filePath, setFilePath] = useState('');

  const selectFile = async () => {
    const result = await showOpenDialog({
      title: dialogText,
      filters
    });

    return result.filePaths;

    return [];
  };

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
                        ? selectedFileLabel || 'Change File'
                        : noSelectedFileLabel || 'Select File'}
                    </Button>
                  </Box>
                </InputAdornment>
              )
            }}
            onInput={(event) => {
              onInputProp?.(event);
            }}
            onClick={async () => {
              const [filePath] = await selectFile();
              setFilePath(filePath);
              onInput({ target: { value: filePath } });
            }}
            error={helpers.error}
          />
        </>
      )}
    />
  );
};
