import { ConfigOrigin } from '@constants/enums';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ConfigOriginSelectProps extends Omit<SelectProps, 'onChange' | 'options'> {
  onChange?: (origin: ConfigOrigin) => void;
}

export const ConfigOriginSelect: React.FC<ConfigOriginSelectProps> = ({ onChange, ...rest }) => {
  const { t } = useI18n();

  return (
    <Select
      {...rest}
      options={[
        { value: ConfigOrigin.SCRIPTS, label: t('localConfigs') },
        { value: ConfigOrigin.CLOUD, label: t('cloudConfigs') }
        // { value: ConfigOrigin.ALL_EXCEPT_INSTALLED_APP, label: 'All Configs' }
      ]}
      onChange={(event) => onChange?.((event.target as HTMLInputElement).value as ConfigOrigin)}
    />
  );
};
