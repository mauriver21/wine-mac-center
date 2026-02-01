import { DownloadWineEngines } from '@components/DownloadWineEngines';
import { EnvPaths } from '@components/EnvPaths';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { Box, ContentsClass, Stack } from 'reactjs-shared-ui';

const ITEM_STYLE = { px: '20px !important' };

export const Settings: React.FC = () => {
  const modules = [<EnvPaths />, <DownloadWineEngines />];

  return (
    <ConfigLayout
      mainTitle="Settings"
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
