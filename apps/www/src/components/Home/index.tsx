import type React from 'react';
import { Stack } from 'reactjs-shared-ui';
import { MainSection } from '@components/MainSection';
import { ScriptsSection } from '@components/ScriptsSection';
import { WineConfigSection } from '@components/WineConfigSection';
import { ContributingSection } from '@components/ContributingSection';

export const Home: React.FC = () => {
  return (
    <Stack spacing={4}>
      <MainSection />
      <ScriptsSection />
      <WineConfigSection />
      <ContributingSection />
    </Stack>
  );
};
