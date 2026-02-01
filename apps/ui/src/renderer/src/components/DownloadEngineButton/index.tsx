import React, { useState } from 'react';
import { IconButton, IconButtonProps } from '@components/IconButton';
import { Download } from '@mui/icons-material';
import { Icon } from 'reactjs-shared-ui';
import { WineEngineDownloadable } from '@interfaces/WineEngineDownloadable';
import { useAppModel } from '@models/useAppModel';
import { useWineEngineApiClient } from '@api-clients/useWineEngineApiClient';

export interface DownloadEngineButtonProps extends Omit<IconButtonProps, 'children' | 'title'> {
  wineEngineDownloadable: WineEngineDownloadable;
}

export const DownloadEngineButton: React.FC<DownloadEngineButtonProps> = ({
  wineEngineDownloadable,
  onClick: onClickProp,
  ...rest
}) => {
  const [downloading, setDownloading] = useState(false);
  const appModel = useAppModel();
  const wineEngineApiClient = useWineEngineApiClient();
  const { urls, version } = wineEngineDownloadable;

  const onClick = (event) => {
    downloadWineEngine(urls, version);
    onClickProp?.(event);
  };

  const downloadWineEngine = async (urls: string[], version: string) => {
    try {
      setDownloading(true);
      await wineEngineApiClient.downloadWineEngine(urls, version);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <IconButton title="Download Engine" onClick={onClick} disabled={downloading} {...rest}>
      <Icon render={Download} />
    </IconButton>
  );
};
