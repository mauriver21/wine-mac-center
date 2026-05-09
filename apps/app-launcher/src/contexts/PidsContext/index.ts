import { createContext } from 'react';

export type PidsContextType = {
  pids: string[];
};

export const PidsContext = createContext<PidsContextType>({} as any);
