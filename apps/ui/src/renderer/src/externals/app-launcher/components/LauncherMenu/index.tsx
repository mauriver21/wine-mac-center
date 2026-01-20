import { useNavigateApp } from '@app-launcher/hooks/useNavigateApp';
import { Button } from '@components/Button';
import React, { useMemo } from 'react';
import { H6, Stack } from 'reactjs-shared-ui';

export const LauncherMenu: React.FC = () => {
  const { navigateToAppConfig } = useNavigateApp();
  const menu = useMemo(
    () => [
      {
        label: 'Configurations',
        onClick: () => {
          navigateToAppConfig();
        }
      }
    ],
    []
  );

  return (
    <Stack spacing={2} position="absolute" top={260} right={40}>
      {menu.map((item) => (
        <Button sx={{ minWidth: 300 }} onClick={item.onClick}>
          <H6>{item.label}</H6>
        </Button>
      ))}
    </Stack>
  );
};
