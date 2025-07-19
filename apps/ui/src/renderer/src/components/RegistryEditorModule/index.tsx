import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';

export const RegistryEditorModule: React.FC = () => {
  const { wineApp, setLoading } = useAppConfigContext() || {};

  return (
    <BaseModule
      label="Wine Config"
      icon={Cog6ToothIcon}
      description={
        <Body1>
          Launches Wine&apos;s Registry Editor to view and modify the Windows-like registry.
        </Body1>
      }
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
