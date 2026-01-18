import { useState } from 'react';
import { Button, Stack } from 'reactjs-shared-ui';
import { useWineAppContext } from '@pages/Test';
import { Code } from '@components/Code';
import { findOutputPids } from '@utils/findOutputPids';
import { TextField } from 'reactjs-shared-ui/forms';

export const ScaffoldApp: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [pids, setPids] = useState('');

  const scaffoldApp = async () => {
    setLoading(true);
    await wineApp.scaffold(
      { appIconURL: '' },
      {
        onStdOut: (data) => {
          const pids = findOutputPids(data);
          pids && setPids(pids);
          setData(data);
        },
        onStdErr: (data) => {
          setData(data);
        }
      }
    );

    setLoading(false);
  };

  return (
    <Stack spacing={2}>
      <div style={{ marginBottom: 10 }}>
        <h3>Scaffold App</h3>
        <hr />
      </div>
      <p>PIDS: {pids}</p>
      <TextField
        InputProps={{ readOnly: true }}
        label="Application name"
        value={wineApp.getAppConfig().name}
      />
      <TextField
        InputProps={{ readOnly: true }}
        label="Application path"
        value={wineApp.getWineEnv().WINE_APP_PATH}
      />
      <TextField
        InputProps={{ readOnly: true }}
        label="Application Contents path"
        value={wineApp.getWineEnv().WINE_APP_CONTENTS_PATH}
      />
      <Button disabled={loading} onClick={scaffoldApp}>
        {loading ? 'Scaffolding' : 'Scaffold'} App
      </Button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </Stack>
  );
};
