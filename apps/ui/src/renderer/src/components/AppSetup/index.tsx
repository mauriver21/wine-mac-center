import { useWineAppModel } from '@models/useWineAppModel';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { useEffect, useState } from 'react';

export interface AppSetupProps {
  children?: React.ReactNode;
}

export const AppSetup: React.FC<AppSetupProps> = ({ children }) => {
  const wineAppModel = useWineAppModel();
  const wineEngineModel = useWineEngineModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const [starting, setStarting] = useState(true);

  const asyncSetup = async () => {
    setStarting(true);
    await Promise.allSettled([
      wineAppModel.listAll(),
      wineInstalledAppModel.listAll(),
      wineEngineModel.list(),
      wineEngineModel.listDownloadables()
    ]);
    setStarting(false);
  };

  useEffect(() => {
    asyncSetup();
  }, []);

  return starting ? <>Starting...</> : <>{children}</>;
};
