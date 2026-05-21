import { useState } from 'react';
import { Code } from '@components/Code';
import { useTestContext } from '..';

export const EnableDxvk: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const enableDxvk = async () => {
    setLoading(true);
    await wineApp.winetrick(
      { verb: 'dxvk1102', version: '20260125' },
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

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>EnableDxvk</h3>
        <hr />
      </div>
      <button disabled={loading} onClick={enableDxvk}>
        EnableDxvk
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
