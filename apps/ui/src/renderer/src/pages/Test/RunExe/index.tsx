import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-shared-ui/forms';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const RunExe: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [exePath, setExePath] = useState('');
  const [data, setData] = useState<any>();

  const runExe = async () => {
    setLoading(true);
    await wineApp.runExe(exePath, {
      onStdOut: (data) => {
        console.log(data);
        setData(data);
      },
      onStdErr: (data) => {
        console.log(data);
        setData(data);
      }
    });
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>RunExe</H6>
          <TextField
            disabled={loading}
            label="Exe Path"
            value={exePath}
            onChange={(event) => setExePath(event.currentTarget.value)}
          />
          <Button disabled={loading || !Boolean(exePath)} onClick={runExe}>
            RunExe
          </Button>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
