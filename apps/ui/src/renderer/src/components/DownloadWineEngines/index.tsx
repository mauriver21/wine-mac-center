import { CardItem } from '@components/CardItem';
import { DownloadEngineButton } from '@components/DownloadEngineButton';
import { CheckIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Stack } from 'reactjs-shared-ui';
import { TextField } from 'reactjs-shared-ui/forms';
import { showItemInFolder } from '@utils/showItemInFolder';
import { IconButton } from '@components/IconButton';
import { Folder } from '@mui/icons-material';
import { useEnv } from '@hooks/useEnv';

export interface DownloadWineEnginesProps {}

export const DownloadWineEngines: React.FC<DownloadWineEnginesProps> = () => {
  const env = useEnv();
  const { WINE_ENGINES_PATH } = env.get();
  const [downloadQueue, setDownloadQueue] = useState<string[]>([]);
  const configLayout = useConfigLayout();
  const wineEngineModel = useWineEngineModel();
  const wineEngines = useSelector(wineEngineModel.selectWineEngines);
  const wineEnginesDownloadables = useSelector(wineEngineModel.selectWineEnginesDownloadables);

  const showEngineLocation = (engineVersion: string) => {
    showItemInFolder(`${WINE_ENGINES_PATH}/${engineVersion}.tar.7z`);
  };

  useEffect(() => {
    wineEngineModel.listDownloadables();
  }, []);

  useEffect(() => {
    configLayout.setLoading(Boolean(downloadQueue.length));
  }, [downloadQueue.length]);

  return (
    <CardItem icon={CpuChipIcon} label="Wine Engines">
      <Stack spacing={2}>
        {wineEnginesDownloadables?.map((item, key) => {
          const isDownloaded = wineEngines?.includes(item.version);

          return (
            <TextField
              sx={{
                '&': { '.engine-location': { display: 'none' } },
                '&:hover': {
                  '.downloaded-icon': { display: 'none' },
                  '.engine-location': { display: 'block' }
                }
              }}
              key={key}
              InputProps={{
                readOnly: true,
                endAdornment: isDownloaded ? (
                  <>
                    <Icon
                      className="downloaded-icon"
                      pr={1}
                      title="Engine Downloaded"
                      color="success.main"
                      render={CheckIcon}
                    />
                    <IconButton
                      className="engine-location"
                      title="Open Location"
                      onClick={() => showEngineLocation(item.version)}
                    >
                      <Icon render={Folder} />
                    </IconButton>
                  </>
                ) : (
                  <DownloadEngineButton
                    setDownloadQueue={setDownloadQueue}
                    wineEngineDownloadable={item}
                  />
                )
              }}
              value={item.version}
            />
          );
        })}
      </Stack>
    </CardItem>
  );
};
