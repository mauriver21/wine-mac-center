import { DownloadWineRepository } from '@components/DownloadWineRepository';
import { InstallWineBuildDependencies } from '@components/InstallWineBuildDependencies';
import { SelectWineVersion } from '@components/SelectWineVersion';
import { BuildWineEngine } from '@components/BuildWineEngine';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useWineModel } from '@models/useWineModel';
import { useSelector } from 'react-redux';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

const ITEM_STYLE = { px: '20px !important' };

export const BuildWine: React.FC = () => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const repositoryDownloaded = useSelector(wineModel.selectRepositoryDownloaded);
  const modules = [
    <DownloadWineRepository />,
    <InstallWineBuildDependencies />,
    ...(repositoryDownloaded ? [<SelectWineVersion />, <BuildWineEngine />] : [])
  ];

  return (
    <ConfigLayout
      mainTitle={t('buildWine')}
      showBack={false}
      contentSlot={
        <Stack
          overflow="auto"
          spacing={1}
          sx={{
            overflowX: 'hidden !important'
          }}
          pb={2}
          alignItems="center"
        >
          {modules.map((item, index) => (
            <Box
              key={index}
              width="100%"
              maxWidth={800}
              pt={2}
              sx={ITEM_STYLE}
              className={ContentsClass.Item}
            >
              {item}
            </Box>
          ))}
        </Stack>
      }
    />
  );
};
