import { useEffect, useState } from 'react';
import { useTestContext } from '..';
import { Select, TextField } from 'reactjs-shared-ui/forms';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const BundleApp: React.FC = () => {
  const { wineApp } = useTestContext();
  const [executables, setExecutables] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [exePath, setExePath] = useState('');
  const [flags, setFlags] = useState('');

  const bundleApp = async () => {
    setLoading(true);
    await wineApp.setExecutables({ executables: [{ path: exePath, main: true, flags }] });
    setLoading(false);
  };

  const listAppExecutables = async () => {
    setExecutables(
      (await wineApp.listAppExecutables()).map((item) => ({
        value: item.path,
        label: item.name
      }))
    );
  };

  useEffect(() => {
    listAppExecutables();
  }, []);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>Bundle App</H6>
          <Select
            options={executables}
            onChange={(event) => setExePath(event.target.value as string)}
          />
          <TextField onChange={(event) => setFlags(event.currentTarget.value)} />
          <Button disabled={loading} onClick={bundleApp}>
            Bundle App
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
