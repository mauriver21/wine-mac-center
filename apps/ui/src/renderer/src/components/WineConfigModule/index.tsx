import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const WineConfigModule: React.FC = () => {
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label="Wine Config"
      icon={Cog6ToothIcon}
      description={
        <Body1>
          Opens Wine&apos;s configuration tool to set Windows version, drives, libraries, and audio
          settings.
        </Body1>
      }
      method={() => {
        setLoading?.(true);
        wineApp?.winecfg({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
