import { useState } from 'react';
import { Body2, Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { useTestContext } from '@pages/Test';
import { Code } from '@components/Code';
import { findOutputPids } from '@utils/findOutputPids';
import { TextField } from 'reactjs-shared-ui/forms';
import { Button } from '@components/Button';

export const ScaffoldApp: React.FC = () => {
  const { wineApp } = useTestContext();
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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>Scaffold App</H6>
          <Body2>PIDS: {pids ? pids : 'No pids available'}</Body2>
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
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
