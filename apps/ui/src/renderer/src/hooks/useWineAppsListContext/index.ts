import { WineAppsListContext } from '@contexts/WineAppsListContext';
import { useContext } from 'react';

export const useWineAppsListContext = () => useContext(WineAppsListContext);
