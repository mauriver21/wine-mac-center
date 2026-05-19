import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Icon } from 'reactjs-shared-ui';
import { TextField, TextFieldProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type SearchFieldProps = TextFieldProps & {};

export const SearchField: React.FC<SearchFieldProps> = (props) => {
  const { t } = useI18n();
  return (
    <TextField
      autoComplete="off"
      InputProps={{
        startAdornment: <Icon pr={1} render={MagnifyingGlassIcon} />
      }}
      placeholder={t('search')}
      {...props}
    />
  );
};
