import { Button } from '@components/Button';
import { useSteamCli } from '@hooks/useSteamCli';
import { DeveloperMode } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { useState } from 'react';
import { Stack, Icon, H6, ContentsClass } from 'reactjs-shared-ui';

export const SteamCliDeveloper: React.FC = () => {
  const steamCli = useSteamCli();
  const [installingSteamCli, setInstallingSteamCli] = useState(false);

  const installSteamCli = () => {
    setInstallingSteamCli(true);
    steamCli.install({
      onStdOut: (data) => {
        console.log(data);
      },
      onStdErr: (data) => {
        console.log(data);
      },
      onExit: (data) => {
        console.log(data);
        setInstallingSteamCli(false);
      }
    });
  };

  return (
    <>
      <Divider
        sx={{
          '&::before': {
            display: 'none',
            pl: 0
          }
        }}
        textAlign="left"
      >
        <Stack direction="row" pr={1}>
          <Icon strokeWidth={0} size={34} render={DeveloperMode} pr={1} />
          <H6 className={ContentsClass.ItemTitle}>Developer</H6>
        </Stack>
      </Divider>
      <Stack direction="row" spacing={2}>
        <Button onClick={installSteamCli} disabled={installingSteamCli}>
          Install Steam CLI
        </Button>
      </Stack>
    </>
  );
};
