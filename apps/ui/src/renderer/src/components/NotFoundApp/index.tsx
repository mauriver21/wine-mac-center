import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { Body1, Box, H5, Icon, Stack } from 'reactjs-ui-core';
import { useParams } from 'react-router-dom';
import { Button } from '@components/Button';
import { useNavigateApp } from '@hooks/useNavigateApp';

export const NotFoundApp: React.FC = () => {
  const { realAppName } = useParams();
  const { navigateToApps } = useNavigateApp();

  return (
    <Box p={2} display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Icon render={FaceFrownIcon} size={128} />
        <H5>Application {realAppName} Not Found.</H5>
        <Button onClick={navigateToApps} sx={{ mt: 2 }}>
          <Body1>Go Back to applications list</Body1>
        </Button>
      </Stack>
    </Box>
  );
};
