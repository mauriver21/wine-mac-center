import React from 'react';
import { BaseModule } from '@components/BaseModule';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { Body1 } from 'reactjs-shared-ui';
import { useWineAppContext } from '@hooks/useWineAppContext';

export const ControlPanelModule: React.FC = () => {
  const { wineApp, setLoading } = useWineAppContext() || {};

  return (
    <BaseModule
      label="Control Panel"
      icon={WrenchScrewdriverIcon}
      description={
        <Body1>
          Opens Wine&apos;s Control Panel to adjust settings like fonts and installed programs.
        </Body1>
      }
      method={() => {
        setLoading?.(true);
        wineApp?.control({
          onExit: () => {
            setLoading?.(false);
          }
        });
      }}
    />
  );
};
