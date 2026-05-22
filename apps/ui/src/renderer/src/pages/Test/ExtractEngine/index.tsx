import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { Button } from '@components/Button';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';

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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>Extract Engine</H6>
          <WineEnginesSelect onChange={(event) => setEngineVersion(event.target.value as string)} />
          <Button disabled={loading || !Boolean(engineVersion)} onClick={extractEngine}>
            {loading ? 'Extracting' : 'Extract'} Engine
          </Button>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
