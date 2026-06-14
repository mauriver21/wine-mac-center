import { License } from '@constants/enums';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type LicensesSelectProps = SelectProps;

export const LicensesSelect: React.FC<LicensesSelectProps> = ({ onChange, ...rest }) => {
  const { t } = useI18n();

  return (
    <Select
      {...rest}
      options={[
        { label: t('paid'), value: License.Paid },
        { label: t('free'), value: License.Free }
      ]}
    />
  );
};
