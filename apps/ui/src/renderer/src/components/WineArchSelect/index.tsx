import { useWineModel } from '@models/useWineModel';
import { useSelector } from 'react-redux';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type WineArchSelectProps = Omit<SelectProps, 'options'>;

export const WineArchSelect: React.FC<WineArchSelectProps> = ({ onChange, ...props }) => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const selectedWineArch = useSelector(wineModel.selectSelectedWineArch);
  const changeArch: SelectProps['onChange'] = (event, child) => {
    wineModel.selectWineArch(event.target.value as string);
    onChange?.(event, child);
  };

  return (
    <Select
      label={t('wineArchitecture')}
      {...props}
      value={props.value ?? selectedWineArch}
      onChange={changeArch}
      options={[
        { label: t('wine32on64Architecture'), value: 'wine32on64' },
        { label: t('wow64Architecture'), value: 'wow64' },
        { label: t('wine64Architecture'), value: 'wine64' }
      ]}
    />
  );
};
