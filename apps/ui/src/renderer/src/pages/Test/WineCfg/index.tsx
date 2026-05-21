import { useState } from 'react';
import { Code } from '@components/Code';
import { useTestContext } from '..';

export const WineCfg: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const bundleApp = async () => {
    setLoading(true);
    await wineApp.winecfg({
      onStdOut: (data) => {
        setData(data);
      },
      onStdErr: (data) => {
        setData(data);
      }
    });
    setLoading(false);
  };

  return (
    <div>
      <button disabled={loading} onClick={bundleApp}>
        winecfg
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
