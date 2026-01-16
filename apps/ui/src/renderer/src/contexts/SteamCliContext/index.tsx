import { createSteamCli } from '@utils/createSteamCli';
import { createContext } from 'react';

type SteamCli = ReturnType<typeof createSteamCli> & { refresh: () => void };

export const SteamCliContext = createContext<SteamCli>({} as any);
