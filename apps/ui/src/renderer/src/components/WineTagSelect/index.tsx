import { useWineModel } from '@models/useWineModel';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export type WineTagSelectProps = SelectProps;

export const WineTagSelect: React.FC<WineTagSelectProps> = (props) => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const repositoryDownloaded = useSelector(wineModel.selectRepositoryDownloaded);
  const wineTags = useSelector(wineModel.selectWineTags);
  const { listingTags } = useSelector(wineModel.selectWineLoaders);

  useEffect(() => {
    if (repositoryDownloaded) wineModel.getWineTags();
  }, [repositoryDownloaded]);

  return (
    <Select
      {...props}
      label={props.label || t('wineVersion')}
      disabled={listingTags || props.disabled}
      options={wineTags.map((tag) => ({ label: tag, value: tag }))}
    />
  );
};
