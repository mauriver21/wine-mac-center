import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { RegeditIcon } from '@assets/icons';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const RegistryEditorModule: React.FC = () => {
  const { t } = useI18n();
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label={t('registryEditor')}
      icon={RegeditIcon}
      description={<Body1>{t('registryEditorDescription')}</Body1>}
      method={() => {
        setLoading?.(true);
        wineApp?.regedit({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
