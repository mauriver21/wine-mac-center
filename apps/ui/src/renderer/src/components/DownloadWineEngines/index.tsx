import { CardItem } from '@components/CardItem';
import { DownloadEngineButton } from '@components/DownloadEngineButton';
import { CheckIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Stack } from 'reactjs-shared-ui';
import { TextField } from 'reactjs-shared-ui/forms';

export interface DownloadWineEnginesProps {}

export const DownloadWineEngines: React.FC<DownloadWineEnginesProps> = () => {
  const [downloadQueue, setDownloadQueue] = useState<string[]>([]);
  const configLayout = useConfigLayout();
  const wineEngineModel = useWineEngineModel();
  const wineEngines = useSelector(wineEngineModel.selectWineEngines);
  const wineEnginesDownloadables = useSelector(wineEngineModel.selectWineEnginesDownloadables);

  useEffect(() => {
    wineEngineModel.listDownloadables();
  }, []);

  useEffect(() => {
    configLayout.setLoading(Boolean(downloadQueue.length));
  }, [downloadQueue.length]);

  return (
    <CardItem icon={CpuChipIcon} label="Wine Engines">
      <Stack spacing={2}>
        {wineEnginesDownloadables?.map((item, key) => (
          <TextField
            key={key}
            InputProps={{
              readOnly: true,
              endAdornment: wineEngines?.includes(item.version) ? (
                <Icon pr={1} title="Engine Downloaded" color="success.main" render={CheckIcon} />
              ) : (
                <DownloadEngineButton
                  setDownloadQueue={setDownloadQueue}
                  wineEngineDownloadable={item}
                />
              )
            }}
            value={item.version}
          />
        ))}
      </Stack>
    </CardItem>
  );
};
