import { useWineEngineModel } from '@models/useWineEngineModel';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type WineEnginesSelectProps = SelectProps;

export const WineEnginesSelect: React.FC<WineEnginesSelectProps> = (props) => {
  const { t } = useI18n();
  const wineEngineModel = useWineEngineModel();
  const wineEngines = useSelector(wineEngineModel.selectWineEngines);

  useEffect(() => {
    wineEngineModel.list();
  }, []);

  return (
    <Select
      label={t('wineEngineVersion')}
      {...props}
      options={wineEngines?.map((item) => ({ label: item, value: item }))}
    />
  );
};
