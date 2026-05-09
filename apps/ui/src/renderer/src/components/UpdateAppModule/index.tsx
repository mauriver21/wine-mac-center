import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { spawnLog } from '@utils/spawnLog';

export const UpdateAppModule: React.FC = () => {
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label="Update App"
      icon={ArrowPathIcon}
      description={<Body1>Updates the application with its latest scripts and dependencies.</Body1>}
      method={() => {
        setLoading?.(true);
        wineApp?.updateWineApp({
          ...spawnLog,
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
