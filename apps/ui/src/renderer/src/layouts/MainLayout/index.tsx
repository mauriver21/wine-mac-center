import { Box } from 'reactjs-shared-ui';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/Sidebar';
import { SIDEBAR_MENU } from '@constants/menus';

export const MainLayout: React.FC = () => {
  return (
    <Box display="grid" gridTemplateColumns="295px 1fr">
      <Sidebar pt={2} pb={1} px={2} bgcolor="secondary.main" menu={SIDEBAR_MENU} />
      <Box display="grid">
        <Outlet />
      </Box>
    </Box>
  );
};
