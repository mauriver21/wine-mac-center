import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const ControlPanelModule: React.FC = () => {
  const { t } = useI18n();
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label={t('controlPanel')}
      icon={WrenchScrewdriverIcon}
      description={<Body1>{t('controlPanelDescription')}</Body1>}
      method={() => {
        setLoading?.(true);
        wineApp?.control({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
