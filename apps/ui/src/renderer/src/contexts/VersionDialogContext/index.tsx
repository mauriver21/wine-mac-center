import { VersionDialogAction } from '@constants/enums';
import { createContext } from 'react';

export type VersionDialogContextType = {
  open: (args: { message: string; action: VersionDialogAction }) => void;
  close: () => void;
};

export const VersionDialogContext = createContext<VersionDialogContextType>({} as any);
