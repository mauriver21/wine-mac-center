import { createContext } from 'react';

export type ScriptsContextProps = {
  setAppName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenConfirmRemoveScript: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ScriptsContext = createContext<ScriptsContextProps | null>(null);
