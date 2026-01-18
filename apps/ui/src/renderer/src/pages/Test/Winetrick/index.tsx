import { useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-shared-ui/forms';
import { findOutputPID } from '@utils/findOutputPID';

export const Winetrick: React.FC = () => {
  const { wineApp } = useWineAppContext();
  const [loading, setLoading] = useState(false);
  const [trick, setTrick] = useState('');
  const [winetrickPid, setWinetrickPid] = useState<number | null>();
  const [data, setData] = useState<any>();

  const winetrick = async () => {
    setLoading(true);
    await wineApp.winetrick(trick, {
      onStdOut: (data) => {
        setWinetrickPid(findOutputPID(data));
        console.log(data);
        setData(data);
      },
      onStdErr: (data) => {
        console.log(data);
        setData(data);
      },
      onExit: (data) => {
        console.log(data);
        setWinetrickPid(undefined);
      }
    });
    setLoading(false);
  };

  const killWinetrick = async () => {
    setLoading(true);
    await wineApp.execScript('killPid', `${winetrickPid}`);
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
      <button disabled={!Boolean(winetrickPid)} onClick={killWinetrick}>
        Kill Winetrick
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
