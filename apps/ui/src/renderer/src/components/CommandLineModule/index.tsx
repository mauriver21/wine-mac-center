import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const CommandLineModule: React.FC = () => {
  const { t } = useI18n();
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label={t('commandLine')}
      icon={CommandLineIcon}
      description={<Body1>{t('commandLineDescription')}</Body1>}
      method={() => {
        setLoading?.(true);
        wineApp?.cmd({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
