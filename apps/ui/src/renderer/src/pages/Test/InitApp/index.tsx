import { useState } from 'react';
import { useTestContext } from '..';
import { createWineApp } from '@utils/createWineApp';
import { TextField } from 'reactjs-shared-ui/forms';
import { Button } from '@components/Button';
import { ContentsClass, H6, Stack } from 'reactjs-shared-ui';

export const InitApp: React.FC = () => {
  const { setWineApp } = useTestContext();
  const [appName, setAppName] = useState('Test App');
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    const wineApp = await createWineApp(appName);
    setWineApp(wineApp);
    setLoading(false);
  };

  return (
    <Stack spacing={1}>
      <H6 className={ContentsClass.ItemTitle}>Init Wine App</H6>
      <TextField
        disabled={loading}
        label="Application name"
        value={appName}
        onChange={(event) => setAppName(event.currentTarget.value)}
      />
      <Button disabled={loading} onClick={start}>
        {loading ? 'Initializing' : 'Init'} App
      </Button>
    </Stack>
  );
};
