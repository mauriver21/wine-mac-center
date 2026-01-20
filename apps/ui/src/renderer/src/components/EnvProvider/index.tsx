import { EnvContext } from '@contexts/EnvContext';
import { createEnv } from '@utils/createEnv';
import { useEffect, useMemo, useState } from 'react';

export interface EnvProviderProps {
  children?: React.ReactNode;
  standaloneApp?: boolean;
}

export const EnvProvider: React.FC<EnvProviderProps> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);

  const { init, ...env } = useMemo(() => createEnv(), []);

  useEffect(() => {
    (async () => {
      setInitializing(true);
      await init(process.env.NODE_ENV);
      setInitializing(false);
    })();
  }, []);

  return <EnvContext.Provider value={env}>{initializing ? <></> : children}</EnvContext.Provider>;
};
