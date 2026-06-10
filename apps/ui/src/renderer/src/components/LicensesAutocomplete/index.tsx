import { License } from '@constants/enums';
import { Autocomplete } from '@mui/material';
import { Field, FieldProps, TextField } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LicensesAutocompleteProps extends FieldProps {}

export const LicensesAutocomplete: React.FC<LicensesAutocompleteProps> = ({
  name = '',
  control,
  fieldOptions,
  value
}) => {
  const { t } = useI18n();
  const OPTIONS = [
    { label: t('paid'), value: License.Paid },
    { label: t('free'), value: License.Free }
  ];

  return (
    <Field
      control={control}
      fieldOptions={fieldOptions}
      as="input"
      name={name}
      value={value}
      render={(field) => (
        <Autocomplete
          value={OPTIONS.find((item) => item.value == field.props.value) || null}
          options={OPTIONS}
          onChange={(_, value) => {
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
      )}
    />
  );
};
