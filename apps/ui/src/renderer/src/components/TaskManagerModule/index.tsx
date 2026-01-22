import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { RectangleStackIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const TaskManagerModule: React.FC = () => {
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label="Task Manager"
      icon={RectangleStackIcon}
      description={
        <Body1>Opens Wine&apos;s Task Manager to monitor and manage running Wine processes.</Body1>
      }
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
