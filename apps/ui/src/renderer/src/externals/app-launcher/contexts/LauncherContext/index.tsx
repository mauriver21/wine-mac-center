import { createContext } from 'react';

export const LauncherContext = createContext<{
  runExe: () => Promise<void>;
  runningMainExe: boolean;
}>({} as any);
