import { SortDirection } from '@interfaces/SortDirection';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface SortDirectionSelectProps extends Omit<SelectProps, 'onChange' | 'options'> {
  onChange?: (direction: SortDirection) => void;
}

export const SortDirectionSelect: React.FC<SortDirectionSelectProps> = ({ onChange, ...rest }) => {
  const { t } = useI18n();

  return (
    <Select
      {...rest}
      options={[
        { label: t('sortAZ'), value: 'asc' },
        { label: t('sortZA'), value: 'desc' }
      ]}
      onChange={(event) => onChange?.((event.target as HTMLInputElement).value as 'asc' | 'desc')}
    />
  );
};
