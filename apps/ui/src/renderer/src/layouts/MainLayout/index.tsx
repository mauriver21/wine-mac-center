import { Box } from 'reactjs-shared-ui';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/Sidebar';
import { AppIcon } from '@assets/icons';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import {
  // InfoOutlined,
  PlayCircleOutline
} from '@mui/icons-material';
import { MenuItem } from '@interfaces/MenuItem';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const MainLayout: React.FC = () => {
  const { t } = useI18n();
  const SIDEBAR_MENU: MenuItem[] = [
    { text: t('apps'), route: 'apps', icon: AppIcon },
    { text: t('scripts'), route: 'scripts', icon: PlayCircleOutline },
    { text: t('settings'), route: 'settings', icon: Cog8ToothIcon }
    // { text: t('about'), route: 'about', icon: InfoOutlined }
  ];

  return (
    <Box display="grid" gridTemplateColumns="295px 1fr" overflow="auto">
      <Sidebar pt={2} pb={1} px={2} bgcolor="secondary.main" menu={SIDEBAR_MENU} />
      <Box display="grid" overflow="auto">
        <Outlet />
      </Box>
    </Box>
  );
};
