import { DEFAULT_WINETRICKS_VERSION } from '@constants/constants';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type WinetricksVersionSelectProps = SelectProps;

export const WinetricksVersionSelect: React.FC<WinetricksVersionSelectProps> = (props) => {
  const { t } = useI18n();

  return (
    <Select
      label={t('winetricksVersion')}
      {...props}
      options={[
        { value: DEFAULT_WINETRICKS_VERSION, label: DEFAULT_WINETRICKS_VERSION },
        { value: '20240105', label: '20240105' }
      ]}
    />
  );
};
