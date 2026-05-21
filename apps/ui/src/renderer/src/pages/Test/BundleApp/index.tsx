import { useEffect, useState } from 'react';
import { useTestContext } from '..';
import { Select, TextField } from 'reactjs-shared-ui/forms';

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
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>Bundle App</h3>
        <hr />
      </div>
      <Select
        options={executables}
        onChange={(event) => setExePath(event.target.value as string)}
      />
      <TextField onChange={(event) => setFlags(event.currentTarget.value)} />
      <button disabled={loading} onClick={bundleApp}>
        Bundle App
      </button>
    </div>
  );
};
