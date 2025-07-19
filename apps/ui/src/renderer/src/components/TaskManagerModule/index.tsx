import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { RectangleStackIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';

export const TaskManagerModule: React.FC = () => {
  const { wineApp, setLoading } = useAppConfigContext() || {};

  return (
    <BaseModule
      label="Wine Config"
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
