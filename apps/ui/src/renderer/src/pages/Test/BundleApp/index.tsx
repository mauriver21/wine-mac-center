import { useEffect, useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { Select, TextField } from 'reactjs-shared-ui/forms';

export const BundleApp: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const [executables, setExecutables] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [exePath, setExePath] = useState('');
  const [flags, setFlags] = useState('');
  const [data, setData] = useState<any>();

  const bundleApp = async () => {
    setLoading(true);
    await wineApp.bundleApp(
      { executables: [{ path: exePath, main: true, flags }] },
      {
        onStdOut: (data) => {
          setData(data);
        },
        onStdErr: (data) => {
          setData(data);
        }
      }
    );
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
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
