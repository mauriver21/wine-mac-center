import { useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-ui-core';

export const Winetrick: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const [loading, setLoading] = useState(false);
  const [trick, setTrick] = useState('');
  const [data, setData] = useState<any>();

  const winetrick = async () => {
    setLoading(true);
    await wineApp.winetrick(trick, {
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
        <h3>Winetrick</h3>
        <hr />
      </div>
      <TextField
        disabled={loading}
        label="Trick"
        value={trick}
        onChange={(event) => setTrick(event.currentTarget.value)}
      />
      <button disabled={loading || !Boolean(trick)} onClick={winetrick}>
        Winetrick
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
