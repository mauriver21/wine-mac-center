import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';

export const Wineboot: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const wineboot = async () => {
    setLoading(true);
    await wineApp.wineboot('', {
      onStdOut: (data) => {
        setData(data);
      },
      onStdErr: (data) => {
        setData(data);
      }
    });
    setLoading(false);
  };

  const winebootU = async () => {
    setLoading(true);
    await wineApp.wineboot('-u', {
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
      <div style={{ marginBottom: 10 }}>
        <h3>Wineboot</h3>
        <hr />
      </div>
      <button disabled={loading} onClick={wineboot}>
        Wineboot
      </button>
      <button style={{ marginLeft: 10 }} disabled={loading} onClick={winebootU}>
        Wineboot -u
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
