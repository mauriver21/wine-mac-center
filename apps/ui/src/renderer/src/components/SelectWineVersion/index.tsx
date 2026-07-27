import { CardItem } from '@components/CardItem';
import { Code } from '@components/Code';
import { WineTagSelect, WineTagSelectProps } from '@components/WineTagSelect';
import { TagIcon } from '@heroicons/react/24/solid';
import { useWineModel } from '@models/useWineModel';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const SelectWineVersion: React.FC = () => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const initializedRef = useRef(false);
  const selectedWineTag = useSelector(wineModel.selectSelectedWineTag);
  const wineTags = useSelector(wineModel.selectWineTags);
  const wineCheckoutOutput = useSelector(wineModel.selectWineCheckoutOutput);
  const { checkingOutTag } = useSelector(wineModel.selectWineLoaders);

  useEffect(() => {
    if (initializedRef.current || wineTags.length === 0) return;
    initializedRef.current = true;

    if (!selectedWineTag || !wineTags.includes(selectedWineTag)) {
      wineModel.checkoutWineTag(wineTags[0]);
    }
  }, [selectedWineTag, wineTags]);

  const selectTag: WineTagSelectProps['onChange'] = (_event, tag) => {
    if (tag) wineModel.checkoutWineTag(tag);
  };

  return (
    <CardItem icon={TagIcon} label={t('selectWineVersion')}>
      <Stack spacing={2}>
        <WineTagSelect
          disabled={checkingOutTag}
          value={selectedWineTag || null}
          onChange={selectTag}
        />
        <Code
          type="content"
          code={wineCheckoutOutput.trim() || t('noOutputToDisplay')}
        />
      </Stack>
    </CardItem>
  );
};
