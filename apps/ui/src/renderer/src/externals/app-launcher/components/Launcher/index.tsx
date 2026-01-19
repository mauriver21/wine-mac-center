import { Outlet } from 'react-router-dom';
import { Box, Card } from 'reactjs-shared-ui';

export const Launcher: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ overflow: 'auto' }}>
      <Box
        position="relative"
        display="grid"
        width="100%"
        height="100%"
        bgcolor="background.paper"
        overflow="auto"
      >
        <Outlet />
      </Box>
    </Card>
  );
};
