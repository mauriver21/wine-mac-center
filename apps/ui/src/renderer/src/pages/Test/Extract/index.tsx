import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { useEnv } from '@hooks/useEnv';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const Extract: React.FC = () => {
  const { wineApp } = useTestContext();
  const env = useEnv();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const extract = async () => {
    setLoading(true);
    const WINE_DOWNLOADS_PATH = env.get().WINE_DOWNLOADS_PATH;
    const from = `${WINE_DOWNLOADS_PATH}/SDW.bin`;
    const target = from.replace(/\.[^.]+$/, '');
    await wineApp.spawnScript('extract', `"${from}" "${target}"`, {
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
          <H6 className={ContentsClass.ItemTitle}>Extract</H6>
          <Button disabled={loading} onClick={extract}>
            {loading ? 'Extracting' : 'Extract'}
          </Button>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
