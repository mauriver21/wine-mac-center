import React from 'react';
import { App as Launcher } from '@app-launcher';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useParams } from 'react-router-dom';
import { Box } from 'reactjs-shared-ui';

export const AppLauncher: React.FC = () => {
  const { appName } = useParams();
  const { navigateToApps } = useNavigateApp();

  return (
    <ConfigLayout
      showTableOfContents={false}
      mainTitle={`${appName} Launcher Preview`}
      backButtonProps={{ onClick: () => navigateToApps() }}
      contentSlot={
        <Box display="grid" margin="auto" maxWidth={980} maxHeight={600} width="100%" height="100%">
          <Launcher />
        </Box>
      }
    />
  );
};
