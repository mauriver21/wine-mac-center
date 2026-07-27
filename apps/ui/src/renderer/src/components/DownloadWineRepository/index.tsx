import { CardItem } from '@components/CardItem';
import { IconButton } from '@components/IconButton';
import { CheckIcon, CloudArrowDownIcon } from '@heroicons/react/24/solid';
import { useConfigLayout } from '@hooks/useConfigLayout';
import { useEnv } from '@hooks/useEnv';
import { useWineModel } from '@models/useWineModel';
import { Download, Folder } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { showItemInFolder } from '@utils/showItemInFolder';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const DownloadWineRepository: React.FC = () => {
  const { t } = useI18n();
  const env = useEnv()
  const WINE_REPOSITORY_PATH = env.get().WINE_REPOSITORY_PATH
  const configLayout = useConfigLayout();
  const wineModel = useWineModel();
  const repositoryDownloaded = useSelector(wineModel.selectRepositoryDownloaded);
  const { checkingRepository, downloadingRepository } = useSelector(wineModel.selectWineLoaders);

  useEffect(() => {
    wineModel.checkWineRepository();
  }, []);

  useEffect(() => {
    configLayout.setLoading(downloadingRepository);
  }, [downloadingRepository]);

  return (
    <CardItem icon={CloudArrowDownIcon} label={t('downloadWineRepository')}>
      <Stack spacing={2}>
        <TextField
          sx={{
            '&': { '.repository-location': { display: 'none' } },
            '&:hover': {
              '.downloaded-icon': { display: 'none' },
              '.repository-location': { display: 'block' }
            }
          }}
          InputProps={{
            readOnly: true,
            endAdornment: downloadingRepository || checkingRepository ? (
              <CircularProgress style={{ width: 20, height: 20 }} />
            ) : repositoryDownloaded ? (
              <>
                <Icon
                  className="downloaded-icon"
                  pr={1}
                  title={t('wineRepositoryDownloaded')}
                  color="success.main"
                  render={CheckIcon}
                />
                <IconButton
                  className="repository-location"
                  title={t('openLocation')}
                  onClick={() => showItemInFolder(WINE_REPOSITORY_PATH)}
                >
                  <Icon render={Folder} />
                </IconButton>
              </>
            ) : (
              <IconButton
                title={t('downloadWineRepository')}
                onClick={() => wineModel.downloadWineRepository()}
              >
                <Icon render={Download} />
              </IconButton>
            )
          }}
          label={t('wineRepository')}
          value={WINE_REPOSITORY_PATH}
        />
      </Stack>
    </CardItem>
  );
};
