import { useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { useEnv } from '@hooks/useEnv';

export const Extract: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const env = useEnv();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const extract = async () => {
    setLoading(true);
    const WINE_DOWNLOADS_PATH = env.get().WINE_DOWNLOADS_PATH;
    const from = `${WINE_DOWNLOADS_PATH}/SDW.bin`;
    const target = from.replace(/\.[^.]+$/, '');
    await wineApp.spawnScript('extract', `"${from}" "${target}"`, {
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
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>Extract</h3>
        <hr />
      </div>
      <button disabled={loading} onClick={extract}>
        {loading ? 'Extracting' : 'Extract'}
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
