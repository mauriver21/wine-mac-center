import { useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-shared-ui/forms';
import { findOutputPids } from '@utils/findOutputPids';
import { spawnLog } from '@utils/spawnLog';

export const Winetrick: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const [loading, setLoading] = useState(false);
  const [trick, setTrick] = useState('');
  const [winetrickPids, setWinetrickPids] = useState<string>('');
  const [data, setData] = useState<any>();

  const winetrick = async () => {
    setLoading(true);
    let pids = '';

    await wineApp.winetrick(trick, {
      onStdOut: (data) => {
        if (!pids) {
          pids = findOutputPids(data);
        }
        setWinetrickPids(pids);
        console.log(data);
        setData(data);
      },
      onStdErr: (data) => {
        console.log(data);
        setData(data);
      },
      onExit: (data) => {
        console.log(data);
        setWinetrickPids('');
      }
    });
    setLoading(false);
  };

  const killWinetrick = async () => {
    setLoading(true);
    await wineApp.spawnScript('killPids', `${winetrickPids}`, spawnLog);
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
      <button style={{ marginRight: 10 }} disabled={loading || !Boolean(trick)} onClick={winetrick}>
        Winetrick
      </button>
      <button disabled={!winetrickPids} onClick={killWinetrick}>
        Kill Winetrick
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
