import { AppIcon } from '@assets/icons';
// import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { MenuItem } from '@interfaces/MenuItem';
import { PlayCircleOutline } from '@mui/icons-material';

export const SIDEBAR_MENU: MenuItem[] = [
  { text: 'Apps', route: 'apps', icon: AppIcon },
  { text: 'Scripts', route: 'scripts', icon: PlayCircleOutline }
  // { text: 'Test', route: 'test', icon: Cog8ToothIcon }
];
