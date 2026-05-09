import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Icon } from 'reactjs-shared-ui';
import { TextField, TextFieldProps } from 'reactjs-shared-ui/forms';

export type SearchFieldProps = TextFieldProps & {};

export const SearchField: React.FC<SearchFieldProps> = (props) => {
  return (
    <TextField
      autoComplete="off"
      InputProps={{
        startAdornment: <Icon pr={1} render={MagnifyingGlassIcon} />
      }}
      placeholder="Search..."
      {...props}
    />
  );
};
