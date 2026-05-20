import React, { useEffect, useState } from 'react';
import { IconButton, IconButtonProps } from '@components/IconButton';
import { Download } from '@mui/icons-material';
import { CircularProgress, Icon } from 'reactjs-shared-ui';
import { WineEngineDownloadable } from '@interfaces/WineEngineDownloadable';
import { useAppModel } from '@models/useAppModel';
import { useWineEngineApiClient } from '@api-clients/useWineEngineApiClient';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface DownloadEngineButtonProps extends Omit<IconButtonProps, 'children' | 'title'> {
  wineEngineDownloadable: WineEngineDownloadable;
  setDownloadQueue: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DownloadEngineButton: React.FC<DownloadEngineButtonProps> = ({
  wineEngineDownloadable,
  setDownloadQueue,
  onClick: onClickProp,
  ...rest
}) => {
  const { t } = useI18n();
  const [downloading, setDownloading] = useState(false);
  const configLayout = useConfigLayout();
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
      setDownloadQueue((prev) => [...prev, version]);
      await wineEngineApiClient.downloadWineEngine(urls, version);
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setDownloading(false);
      setDownloadQueue((prev) => prev.filter((item) => item !== version));
    }
  };

  useEffect(() => {
    configLayout.setLoading(downloading);
  }, [downloading]);

  return (
    <IconButton title={t('downloadEngine')} onClick={onClick} disabled={downloading} {...rest}>
      {downloading ? (
        <CircularProgress style={{ width: 20, height: 20 }} />
      ) : (
        <Icon render={Download} />
      )}
    </IconButton>
  );
};
