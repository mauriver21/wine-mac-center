import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { WineEnginesSelect } from '@components/WineEnginesSelect';

export const ExtractEngine: React.FC = () => {
  const { wineApp } = useTestContext();
  const [engineVersion, setEngineVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const extractEngine = async () => {
    setLoading(true);
    await wineApp.extractEngine(engineVersion, {
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
        <h3>Extract Engine</h3>
        <hr />
      </div>
      <WineEnginesSelect onChange={(event) => setEngineVersion(event.target.value as string)} />
      <button disabled={loading || !Boolean(engineVersion)} onClick={extractEngine}>
        {loading ? 'Extracting' : 'Extract'} Engine
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
