import { useState } from 'react';
import { useWineAppContext } from '..';
import { createWineApp } from '@utils/createWineApp';
import { TextField } from 'reactjs-shared-ui/forms';

export const InitApp: React.FC = () => {
  const { setWineApp } = useWineAppContext();
  const [appName, setAppName] = useState('Test App');
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);
    const wineApp = await createWineApp(appName);
    setWineApp(wineApp);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>Init Wine App</h3>
        <hr />
      </div>
      <TextField
        disabled={loading}
        label="Application name"
        value={appName}
        onChange={(event) => setAppName(event.currentTarget.value)}
      />
      <button disabled={loading} onClick={start}>
        {loading ? 'Initializing' : 'Init'} App
      </button>
    </div>
  );
};
