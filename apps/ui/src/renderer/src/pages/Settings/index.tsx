import { DownloadWineEngines } from '@components/DownloadWineEngines';
import { EnvPaths } from '@components/EnvPaths';
import { Languages } from '@components/Languages';
import { SteamCredentials } from '@components/SteamCredentials';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

const ITEM_STYLE = { px: '20px !important' };

export const Settings: React.FC = () => {
  const { t } = useI18n();
  const modules = [<Languages />, <EnvPaths />, <DownloadWineEngines />, <SteamCredentials />];

  return (
    <ConfigLayout
      mainTitle={t('settings')}
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
