import { MainHeader } from '@components/MainHeader';
import { Outlet } from 'react-router-dom';
import { Box } from 'reactjs-shared-ui';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <Box display="grid" gridTemplateRows="auto 1fr">
      <MainHeader />
      <Outlet />
    </Box>
  );
};
