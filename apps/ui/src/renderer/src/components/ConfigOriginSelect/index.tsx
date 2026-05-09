import { ConfigOrigin } from '@constants/enums';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';

export interface ConfigOriginSelectProps extends Omit<SelectProps, 'onChange' | 'options'> {
  onChange?: (origin: ConfigOrigin) => void;
}

export const ConfigOriginSelect: React.FC<ConfigOriginSelectProps> = ({ onChange, ...rest }) => {
  return (
    <Select
      {...rest}
      options={[
        { value: ConfigOrigin.SCRIPTS, label: 'Local Configs' },
        { value: ConfigOrigin.CLOUD, label: 'Cloud Configs' }
        // { value: ConfigOrigin.ALL_EXCEPT_INSTALLED_APP, label: 'All Configs' }
      ]}
      onChange={(event) => onChange?.((event.target as HTMLInputElement).value as ConfigOrigin)}
    />
  );
};
