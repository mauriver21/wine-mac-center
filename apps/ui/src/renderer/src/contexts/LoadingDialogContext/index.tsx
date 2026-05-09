import { createContext } from 'react';

export type LoadingDialogContextType = {
  open: (args: { message: string }) => void;
  close: () => void;
};

export const LoadingDialogContext = createContext<LoadingDialogContextType>({} as any);
