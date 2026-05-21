import { useState } from 'react';
import { useTestContext } from '..';
import { TextField } from 'reactjs-shared-ui/forms';

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
    <div style={{ marginBottom: 10 }}>
      <div style={{ marginBottom: 10 }}>
        <h3>Set Setup Executable</h3>
        <TextField
          value={setupExecutablePath}
          onChange={(event) => setSetupExecutablePath(event.target.value)}
        />
      </div>
      <button disabled={loading || !Boolean(setupExecutablePath)} onClick={setSetupExe}>
        Set Setup Exe
      </button>
      <div style={{ marginBottom: 10 }}>
        <h3>Run Setup Executable</h3>
        <hr />
      </div>
      <div>
        <TextField InputProps={{ readOnly: true }} value={configuredSetupExecutablePath} />
      </div>
      <button disabled={loading || !Boolean(configuredSetupExecutablePath)} onClick={runSetupExe}>
        Run Setup Executable
      </button>
    </div>
  );
};
