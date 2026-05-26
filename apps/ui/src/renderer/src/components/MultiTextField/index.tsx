import { XMarkIcon } from '@heroicons/react/24/solid';
import { Chip, IconButton, TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, FormHelperText, Icon, Stack } from 'reactjs-shared-ui';
import { Field, FieldProps } from 'reactjs-shared-ui/forms';

export type MultiTextFieldProps = Omit<TextFieldProps & FieldProps, 'value' | 'onInput'> & {
  value?: string[];
  onInput?: (value?: string[]) => void;
};

export const MultiTextField: React.FC<MultiTextFieldProps> = ({
  fullWidth = true,
  helperText,
  control,
  fieldOptions,
  onInput,
  onBlur,
  value: valueProp,
  ...rest
}) => {
  const [value, setValue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (valueProp !== undefined) setValue(valueProp);
  }, [valueProp?.length]);

  return (
    <Field
      as="input"
      fieldOptions={fieldOptions}
      control={control}
      onInput={onInput}
      onBlur={onBlur}
      {...rest}
      render={({ props, helpers }) => {
        const onInput: TextFieldProps['onInput'] = (event) => {
          const value = (event.target as HTMLInputElement).value;
          const endsWithColon = value?.match(/[^,\s][^,]*,$/);

          if (endsWithColon) {
            setValue((prev) => [...prev, value.replace(/,$/, '')]);
            setInputValue('');
          } else {
            setInputValue(value);
          }

          props?.onInput(value);
        };

        return (
          <Stack spacing={1} width={fullWidth ? '100%' : undefined}>
            <TextField {...props} {...rest} value={inputValue} onInput={onInput} />
            {value.length ? (
              <Box>
                {value.map((item) => (
                  <Box
                    display="inline-block"
                    position="relative"
                    sx={{ '&:hover .chip': { display: 'block' } }}
                  >
                    <Chip sx={{ marginBottom: 1, marginRight: 1 }} label={item} />
                    <IconButton
                      className="chip"
                      sx={{ position: 'absolute', top: -15, right: -5, display: 'none' }}
                      onClick={() => {
                        setValue((prev) => {
                          const newValue = [...prev].filter((x) => x !== item);
                          props?.onInput(newValue);
                          return newValue;
                        });
                      }}
                    >
                      <Icon render={XMarkIcon} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <></>
            )}
            {helpers.errorMessage && (
              <FormHelperText error={helpers.error}>{helpers.errorMessage}</FormHelperText>
            )}
          </Stack>
        );
      }}
    />
  );
};
