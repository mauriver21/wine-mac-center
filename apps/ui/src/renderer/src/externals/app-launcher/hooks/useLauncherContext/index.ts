import { LauncherContext } from '@app-launcher/contexts/LauncherContext';
import { useContext } from 'react';

export const useLauncherContext = () => useContext(LauncherContext);
