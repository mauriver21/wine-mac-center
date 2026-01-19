import { Outlet } from 'react-router-dom';
import { Box } from 'reactjs-shared-ui';

export const MainLayout = () => {
  return (
    <Box
      display="grid"
      width="100%"
      height="100%"
      bgcolor="secondary.main"
      position="relative"
      overflow="auto"
    >
      <Outlet />
    </Box>
  );
};
