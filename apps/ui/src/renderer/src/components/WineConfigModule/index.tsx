import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';

export const WineConfigModule: React.FC = () => {
  const { wineApp, setLoading } = useAppConfigContext() || {};

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
