import { License } from '@constants/enums';
import { Autocomplete } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Field, FieldProps, TextField } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LicensesAutocompleteProps extends FieldProps {}

export const LicensesAutocomplete: React.FC<LicensesAutocompleteProps> = ({
  name = '',
  control,
  fieldOptions,
  value: valueProp
}) => {
  const { t } = useI18n();
  const ref = useRef({ rendered: false });
  const [value, setValue] = useState<string | undefined>('');
  const OPTIONS = [
    { label: t('paid'), value: License.Paid },
    { label: t('free'), value: License.Free }
  ];

  const selectedValue = useMemo(() => {
    return OPTIONS.find((item) => item.value == value);
  }, [value]);

  useEffect(() => {
    valueProp !== undefined && setValue(valueProp);
  }, [valueProp]);

  useEffect(() => {
    return () => {
      ref.current.rendered = false;
    };
  }, []);

  return (
    <Field
      control={control}
      fieldOptions={fieldOptions}
      as="input"
      name={name}
      value={value}
      render={(field) => {
        useEffect(() => {
          if (!ref.current.rendered) {
            setValue(field.props.value);
            ref.current.rendered = true;
          }
        }, [field.props.value]);

        return (
          <Autocomplete
            value={selectedValue || null}
            options={OPTIONS}
            onChange={(_, value) => {
              setValue(value?.value);
              field.props.onInput(value);
            }}
            renderInput={(params) => (
              <TextField
                error={field.helpers.error}
                errorMessage={field.helpers.errorMessage}
                {...params}
                label={t('license')}
              />
            )}
            onBlur={field.props.onBlur}
            onClose={field.props.onBlur}
          />
        );
      }}
    />
  );
};
