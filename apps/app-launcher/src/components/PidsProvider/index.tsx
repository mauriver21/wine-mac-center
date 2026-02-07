import { useState } from 'react';
import { PidsContext } from '@contexts/PidsContext';

export interface PidsProviderProps {
  children?: React.ReactElement;
}

export const PidsProvider: React.FC<PidsProviderProps> = ({ children }) => {
  const [pids] = useState<string[]>([]);

  return (
    <PidsContext.Provider value={{ pids }}>{children}</PidsContext.Provider>
  );
};
