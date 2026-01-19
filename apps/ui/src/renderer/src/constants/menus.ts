import { AppIcon } from '@assets/icons';
import { Cog8ToothIcon, EyeIcon } from '@heroicons/react/24/solid';
import { MenuItem } from '@interfaces/MenuItem';
import { Launch, PlayCircleOutline } from '@mui/icons-material';

export const SIDEBAR_MENU: MenuItem[] = [
  { text: 'Apps', route: 'apps', icon: AppIcon },
  { text: 'Scripts', route: 'scripts', icon: PlayCircleOutline },
  { text: 'Settings', route: 'settings', icon: Cog8ToothIcon },
  { text: 'App Launcher', route: 'app-launcher', icon: Launch },
  { text: 'Test', route: 'test', icon: EyeIcon }
];
