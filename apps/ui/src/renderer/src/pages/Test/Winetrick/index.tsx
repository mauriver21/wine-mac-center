import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { TextField } from 'reactjs-shared-ui/forms';
import { spawnLog } from '@utils/spawnLog';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>Winetrick</H6>
          <TextField
            disabled={loading}
            label="Trick"
            value={trick}
            onChange={(event) => setTrick(event.currentTarget.value)}
          />
          <Stack direction="row" spacing={2}>
            <Button disabled={loading || !Boolean(trick)} onClick={winetrick}>
              Winetrick
            </Button>
            <Button onClick={killWinetrick}>Kill Winetrick</Button>
            <Button onClick={forceKillWinetrick}>Force Kill Winetrick</Button>
          </Stack>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
