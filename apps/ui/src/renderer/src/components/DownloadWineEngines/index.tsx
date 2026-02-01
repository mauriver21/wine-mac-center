import { CardItem } from '@components/CardItem';
import { CheckIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Stack } from 'reactjs-shared-ui';
import { TextField } from 'reactjs-shared-ui/forms';

export interface DownloadWineEnginesProps {}

export const DownloadWineEngines: React.FC<DownloadWineEnginesProps> = () => {
  const wineEngineModel = useWineEngineModel();
  const wineEngines = useSelector(wineEngineModel.selectWineEngines);
  const wineEnginesDownloadables = useSelector(wineEngineModel.selectWineEnginesDownloadables);

  useEffect(() => {
    wineEngineModel.list();
  }, []);

  return (
    <CardItem icon={CpuChipIcon} label="Wine Engines">
      <Stack spacing={2}>
        {wineEnginesDownloadables?.map((item) => (
          <TextField
            InputProps={{
              readOnly: true,
              endAdornment: wineEngines?.includes(item.version) ? (
                <IconButton title="Download Engine">
                  <Icon color="success.main" render={CheckIcon} />
                </IconButton>
              ) : (
                <IconButton title="Download Engine">
                  <Icon render={Download} />
                </IconButton>
              )
            }}
            value={item.version}
          />
        ))}
      </Stack>
    </CardItem>
  );
};
