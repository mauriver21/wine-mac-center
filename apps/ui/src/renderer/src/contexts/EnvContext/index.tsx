import { createEnv } from '@utils/createEnv';
import { createContext } from 'react';

type Env = Omit<ReturnType<typeof createEnv>, 'init'>;

export const EnvContext = createContext<Env>({} as any);
