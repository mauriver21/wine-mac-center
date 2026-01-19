import { Button } from '@components/Button';
import { useMemo } from 'react';
import { Box, H6, Stack } from 'reactjs-shared-ui';

export const Launcher: React.FC = () => {
  const menu = useMemo(() => [{ label: 'Run Application' }, { label: 'Configurations' }], []);

  return (
    <Box
      display="grid"
      width="100%"
      height="100%"
      bgcolor="secondary.main"
      p={2}
      position="relative"
    >
      <Stack spacing={2} position="absolute" top={260} right={40}>
        {menu.map((item) => (
          <Button sx={{ minWidth: 300 }}>
            <H6>{item.label}</H6>
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
