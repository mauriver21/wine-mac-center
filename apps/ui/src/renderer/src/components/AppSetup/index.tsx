import { useLocalState } from '@hooks/useLocalState';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { useEffect, useState } from 'react';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface AppSetupProps {
  children?: React.ReactNode;
}

export const AppSetup: React.FC<AppSetupProps> = ({ children }) => {
  const { changeLanguage, getLanguage } = useI18n();
  const { getState } = useLocalState('lang');
  const wineAppConfigModel = useWineAppConfigModel();
  const wineEngineModel = useWineEngineModel();
  const wineInstalledAppModel = useWineInstalledAppModel();
  const [starting, setStarting] = useState(true);

  const asyncSetup = async () => {
    setStarting(true);
    changeLanguage(getState()?.lang || getLanguage());
    await Promise.allSettled([
      wineAppConfigModel.listAll(),
      wineInstalledAppModel.listAll(),
      wineEngineModel.list(),
      wineEngineModel.listDownloadables()
    ]);
    setStarting(false);
  };

  useEffect(() => {
    asyncSetup();
  }, []);

  return starting ? <></> : <>{children}</>;
};
