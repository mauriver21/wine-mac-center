import type React from 'react';
import WindowImage from '@assets/imgs/window-image.png';
import { Body1, Box, H4, H5, Icon, Image, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { FolderArrowDownIcon } from '@heroicons/react/16/solid';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const MainSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <Box display="grid" gridTemplateColumns="1.5fr 2fr" id="download" pt={4}>
      <Stack p={2} spacing={2}>
        <H4>
          {t('organizeAndLaunchWindowsAppsOnMac')}{' '}
          <H4 component="span" color="info" fontWeight="bold">
            {t('fromASinglePlace')}
          </H4>
        </H4>
        <Body1>
          {t('wineMacCenterDescription')}
        </Body1>
        <Button
          sx={{ marginTop: 3 }}
          onClick={() =>
            window.open(
              'https://github.com/mauriver21/wine-mac-center/releases',
              '_blank',
            )
          }
        >
          <Icon size={24} pr={1} render={FolderArrowDownIcon} />
          <H5>{t('download')}</H5>
        </Button>
      </Stack>
      <Stack>
        <Image width="100%" src={WindowImage} />
      </Stack>
    </Box>
  );
};
