import { useEffect, useState } from 'react';
import { Box, Button } from 'reactjs-shared-ui';
import { Field, TextField, TextFieldProps } from 'reactjs-shared-ui/forms';
import { InputAdornment } from '@mui/material';
import { openFile } from '@utils/openFile';

export type FileInputProps = Omit<
  TextFieldProps,
  'type' | 'label' | 'accept' | 'onInput' | 'value'
> & {
  noSelectedFileLabel?: string;
  selectedFileLabel?: string;
  dialogText?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  onInput?: (file: File | undefined) => void;
  value?: string;
};

export const FileInput: React.FC<FileInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value = '',
  noSelectedFileLabel,
  selectedFileLabel,
  dialogText = 'Select file',
  filters = undefined,
  ...rest
}) => {
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    value && setFileName(value);
  }, [value]);

  return (
    <Field
      control={control}
      fieldOptions={fieldOptions}
      as="input"
      name={name}
      render={({ props: { onInput }, helpers }) => (
        <TextField
          fullWidth
          {...rest}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <Box pr={2}>
                  <Button type="button">
                    {fileName
                      ? selectedFileLabel || 'Change File'
                      : noSelectedFileLabel || 'Select File'}
                  </Button>
                </Box>
              </InputAdornment>
            )
          }}
          value={fileName}
          onClick={async () => {
            const { file, fileName } = await openFile(dialogText, { filters });
            setFileName(fileName);
            onInput({ target: { value: file } });
            onInputProp?.(file);
          }}
          error={helpers.error}
          errorMessage={helpers.errorMessage}
        />
      )}
    />
  );
};
