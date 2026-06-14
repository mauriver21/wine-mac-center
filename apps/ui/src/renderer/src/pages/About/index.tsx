import React from 'react';
import { t } from 'i18next';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { Stack, Box, ContentsClass } from 'reactjs-shared-ui';
import { AppVersion } from '@components/AppVersion';
import { Donations } from '@components/Donations';
import { ProjectInfo } from '@components/ProjectInfo';
import { Acknowledgements } from '@components/Acknowledgements';

const ITEM_STYLE = { px: '20px !important' };

export const About: React.FC = () => {
  const modules = [<AppVersion />, <ProjectInfo />, <Acknowledgements />, <Donations />];

  return (
    <ConfigLayout
      mainTitle={t('about')}
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
