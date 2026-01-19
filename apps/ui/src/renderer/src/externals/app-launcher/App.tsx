import { EnvProvider } from '@components/EnvProvider';
import React from 'react';
import { Launcher } from '@app-launcher/components/Launcher';

export const App: React.FC = () => {
  return (
    <EnvProvider>
      <Launcher />
    </EnvProvider>
  );
};
