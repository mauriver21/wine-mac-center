import { createSteamCli } from '@utils/createSteamCli';
import { createContext } from 'react';

type SteamCli = ReturnType<typeof createSteamCli>;

export const SteamCliContext = createContext<SteamCli>({} as any);
