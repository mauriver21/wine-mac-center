import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { RectangleStackIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const TaskManagerModule: React.FC = () => {
  const { t } = useI18n();
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label={t('taskManager')}
      icon={RectangleStackIcon}
      description={<Body1>{t('taskManagerDescription')}</Body1>}
      method={() => {
        setLoading?.(true);
        wineApp?.taskmgr({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
