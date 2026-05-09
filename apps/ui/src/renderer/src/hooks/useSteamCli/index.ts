import { SteamCliContext } from '@contexts/SteamCliContext';
import { useContext } from 'react';

export const useSteamCli = () => useContext(SteamCliContext);
