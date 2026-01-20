import { EnvContext } from '@contexts/EnvContext';
import { createEnv } from '@utils/createEnv';
import { useEffect, useMemo, useState } from 'react';

export interface EnvProviderProps {
  children?: React.ReactNode;
  standaloneApp?: boolean;
  APPLICATION_PATH_OVERRIDE?: string;
  development?: boolean;
}

export const EnvProvider: React.FC<EnvProviderProps> = ({
  children,
  standaloneApp,
  APPLICATION_PATH_OVERRIDE,
  development = false
}) => {
  const [initializing, setInitializing] = useState(true);
  const [isDev] = useState(development);

  const { init, ...env } = useMemo(
    () => createEnv({ standaloneApp, APPLICATION_PATH_OVERRIDE }),
    []
  );

  useEffect(() => {
    (async () => {
      setInitializing(true);
      await init(process.env.NODE_ENV);
      setInitializing(false);
    })();
  }, []);

  return (
    <EnvContext.Provider value={{ ...env, isDev }}>
      {initializing ? <></> : children}
    </EnvContext.Provider>
  );
};
