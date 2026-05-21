import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-shared-ui/forms';
import { spawnLog } from '@utils/spawnLog';

export const Winetrick: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [trick, setTrick] = useState('');
  const [data, setData] = useState<any>();

  const winetrick = async () => {
    setLoading(true);
    await wineApp.winetrick(
      { verb: trick, version: '20260125' },
      {
        onStdOut: (data) => {
          console.log(data);
          setData(data);
        },
        onStdErr: (data) => {
          console.log(data);
          setData(data);
        },
        onExit: (data) => {
          console.log(data);
        }
      }
    );
    setLoading(false);
  };

  const killWinetrick = async () => {
    setLoading(true);
    await wineApp.spawnScript('killWinetricks', '', spawnLog);
    setLoading(false);
  };

  const forceKillWinetrick = async () => {
    setLoading(true);
    await wineApp.spawnScript('killWinetricks', '-f', spawnLog);
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
      <button onClick={killWinetrick}>Kill Winetrick</button>
      <button onClick={forceKillWinetrick}>Force Kill Winetrick</button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
