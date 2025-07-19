import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';

export const CommandLineModule: React.FC = () => {
  const { wineApp, setLoading } = useAppConfigContext() || {};

  return (
    <BaseModule
      label="Command Line"
      icon={CommandLineIcon}
      description={
        <Body1>
          Starts a Windows-like command prompt for running commands and scripts in Wine.
        </Body1>
      }
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
