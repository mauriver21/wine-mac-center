import { SortDirection } from '@interfaces/SortDirection';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';

export interface SortDirectionSelectProps extends Omit<SelectProps, 'onChange' | 'options'> {
  onChange?: (direction: SortDirection) => void;
}

export const SortDirectionSelect: React.FC<SortDirectionSelectProps> = ({ onChange, ...rest }) => {
  return (
    <Select
      {...rest}
      options={[
        { label: 'Sort A-Z', value: 'asc' },
        { label: 'Sort Z-A', value: 'desc' }
      ]}
      onChange={(event) => onChange?.((event.target as HTMLInputElement).value as 'asc' | 'desc')}
    />
  );
};
