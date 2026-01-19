import { Button } from '@components/Button';
import React, { useMemo } from 'react';
import { H6, Stack } from 'reactjs-shared-ui';

export const LauncherMenu: React.FC = () => {
  const menu = useMemo(() => [{ label: 'Run Application' }, { label: 'Configurations' }], []);

  return (
    <Stack spacing={2} position="absolute" top={260} right={40}>
      {menu.map((item) => (
        <Button sx={{ minWidth: 300 }}>
          <H6>{item.label}</H6>
        </Button>
      ))}
    </Stack>
  );
};
