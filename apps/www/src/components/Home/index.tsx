import type React from 'react';
import { Box } from 'reactjs-shared-ui';
import { MainSection } from '@components/MainSection';
import { ScriptsSection } from '@components/ScriptsSection';

export const Home: React.FC = () => {
  return (
    <Box>
      <MainSection />
      <ScriptsSection />
    </Box>
  );
};
