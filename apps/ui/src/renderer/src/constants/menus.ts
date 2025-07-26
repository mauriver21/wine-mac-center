import { AppIcon, HomeIcon } from '@assets/icons';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { MenuItem } from '@interfaces/MenuItem';

export const SIDEBAR_MENU: MenuItem[] = [
  { text: 'Home', route: 'home', icon: HomeIcon },
  { text: 'Apps', route: 'apps', icon: AppIcon },
  { text: 'Test', route: 'test', icon: Cog8ToothIcon }
];
