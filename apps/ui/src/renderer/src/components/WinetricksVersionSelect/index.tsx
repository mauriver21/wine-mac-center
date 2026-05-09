import { DEFAULT_WINETRICKS_VERSION } from '@constants/constants';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';

export type WinetricksVersionSelectProps = SelectProps;

export const WinetricksVersionSelect: React.FC<WinetricksVersionSelectProps> = (props) => {
  return (
    <Select
      label="Winetricks Version"
      {...props}
      options={[
        { value: DEFAULT_WINETRICKS_VERSION, label: DEFAULT_WINETRICKS_VERSION },
        { value: '20240105', label: '20240105' }
      ]}
    />
  );
};
