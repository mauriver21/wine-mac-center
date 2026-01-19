import { Launcher } from '@app-launcher/components/Launcher';
import { useNavigateApp } from '@hooks/useNavigateApp';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, H6, Button } from 'reactjs-shared-ui';

export const AppLauncher: React.FC = () => {
  const { appName } = useParams();
  const { navigateToApps } = useNavigateApp();

  return (
    <Box display="grid" overflow="auto" gridTemplateRows="auto 1fr">
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          boxShadow: (theme) => `inset 0 -1px ${theme.palette.secondary.main}`
        }}
      >
        <H6 color="text.secondary" fontWeight={500}>
          {appName} Launcher Preview
        </H6>
        <Button
          sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
          color="secondary"
          onClick={() => navigateToApps()}
        >
          Back
        </Button>
      </Box>
      <Box width="100%" display="grid" overflow="auto">
        <Box display="grid" margin="auto" maxWidth={980} maxHeight={600} width="100%" height="100%">
          <Launcher />
        </Box>
      </Box>
    </Box>
  );
};
