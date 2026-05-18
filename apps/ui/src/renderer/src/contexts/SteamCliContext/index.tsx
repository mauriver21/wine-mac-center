import { SpawnProcessArgs } from '@interfaces/SpawnProcessArgs';
import { SteamCredentials } from '@interfaces/SteamCredentials';
import { createSteamCli } from '@utils/createSteamCli';
import { createContext } from 'react';

type SteamCli = ReturnType<typeof createSteamCli> & {
  login: (credentials: SteamCredentials, args?: SpawnProcessArgs) => Promise<unknown>;
  refresh: () => void;
  askSteamCredentials: () => Promise<void>;
};

export const SteamCliContext = createContext<SteamCli>({} as any);
