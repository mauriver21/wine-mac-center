import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LabelsAutocompleteProps extends FieldProps {}

export const LabelsAutocomplete: React.FC<LabelsAutocompleteProps> = ({
  name = '',
  control,
  fieldOptions,
  value: valueProp,
  ...rest
}) => {
  const { t } = useI18n();
  const [value, setValue] = useState<string | undefined>('');
  const OPTIONS = [
    { label: t('steamApp'), value: 'steamApp' },
    { label: t('abandonware'), value: 'abandonware' },
    { label: t('free'), value: 'free' }
  ];

  const selectedValue = useMemo(() => {
    return OPTIONS.find((item) => item.value == value);
  }, [value]);

  useEffect(() => {
    valueProp !== undefined && setValue(valueProp);
  }, [valueProp]);

  return (
    <Field
      control={control}
      fieldOptions={fieldOptions}
      as="input"
      name={name}
      value={value}
      render={(field) => (
        <Autocomplete
          value={selectedValue}
          options={OPTIONS}
          onChange={(_, value) => {
            setValue(value?.value);
            field.props.onInput(value);
          }}
          renderInput={(params) => <TextField {...params} label={t('label')} />}
          {...rest}
        />
      )}
    />
  );
};
