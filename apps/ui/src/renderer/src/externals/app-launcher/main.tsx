import React from 'react';
import { EnvProvider } from '@components/EnvProvider';
import { App } from './App';

export const Main: React.FC = () => {
  return (
    <EnvProvider>
      <App />
    </EnvProvider>
  );
};
