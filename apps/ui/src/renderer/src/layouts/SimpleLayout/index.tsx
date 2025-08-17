import { Box } from 'reactjs-shared-ui';
import { Outlet } from 'react-router-dom';

export const SimpleLayout: React.FC = () => {
  return (
    <Box display="grid" overflow="auto">
      <Outlet />
    </Box>
  );
};
