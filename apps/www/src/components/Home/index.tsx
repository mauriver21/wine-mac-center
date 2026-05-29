import type React from 'react';
import { Stack } from 'reactjs-shared-ui';
import { MainSection } from '@components/MainSection';
import { ScriptsSection } from '@components/ScriptsSection';
import { WineConfigSection } from '@components/WineConfigSection';

export const Home: React.FC = () => {
  return (
    <Stack spacing={4}>
      <MainSection />
      <ScriptsSection />
      <WineConfigSection />
    </Stack>
  );
};
