import { useState } from 'react';
import { useTestContext } from '..';
import { TextField } from 'reactjs-shared-ui/forms';
import { Button, Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';

/**
 * Examples:
 * - Setup executable from URL
 * https://raw.githubusercontent.com/webblocksapp/wine-mac-center/master/packages/wine-apps-configs/src/downloadables/setup-executables/SteamSetup.exe
 *
 */

export const SetSetupExe: React.FC = () => {
  const { wineApp } = useTestContext();
  const configuredSetupExecutablePath = wineApp.getAppConfig().setupExecutablePath || '';
  const [setupExecutablePath, setSetupExecutablePath] = useState(
    configuredSetupExecutablePath || ''
  );
  const [loading, setLoading] = useState(false);

  const setSetupExe = async () => {
    setLoading(true);
    await wineApp.setSetupExe(setupExecutablePath);
    setLoading(false);
  };

  const runSetupExe = () => {
    setLoading(true);
    wineApp.runExe(configuredSetupExecutablePath, {
      onStdOut: (data) => {
        console.log(data);
      },
      onStdErr: (data) => {
        console.log(data);
      },
      onExit: (data) => {
        console.log(data);
        setLoading(false);
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>Set Setup Executable</H6>
          <TextField
            value={setupExecutablePath}
            onChange={(event) => setSetupExecutablePath(event.target.value)}
          />
          <Button disabled={loading || !Boolean(setupExecutablePath)} onClick={setSetupExe}>
            Set Setup Exe
          </Button>
          <H6>Run Setup Executable</H6>
          <TextField InputProps={{ readOnly: true }} value={configuredSetupExecutablePath} />
          <Button
            disabled={loading || !Boolean(configuredSetupExecutablePath)}
            onClick={runSetupExe}
          >
            Run Setup Executable
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
