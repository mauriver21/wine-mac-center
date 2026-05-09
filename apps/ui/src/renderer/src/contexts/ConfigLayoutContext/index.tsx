import { createContext } from 'react';

export const ConfigLayoutContext = createContext<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({} as any);
