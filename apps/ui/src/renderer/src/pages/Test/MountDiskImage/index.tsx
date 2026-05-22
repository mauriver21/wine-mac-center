import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { useEnv } from '@hooks/useEnv';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const MountDiskImage: React.FC = () => {
  const { wineApp } = useTestContext();
  const env = useEnv();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const mountDiskImage = async () => {
    setLoading(true);
    const WINE_DOWNLOADS_PATH = env.get().WINE_DOWNLOADS_PATH;
    const from = `${WINE_DOWNLOADS_PATH}/RalphLupo/SDW.bin`;
    await wineApp.spawnScript('mountDiskImage', `"${from}"`, {
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

  const unmountVolume = async () => {
    setLoading(true);
    await wineApp.spawnScript('unmountVolume', `"/Volumes/LOTRBFME2"`, {
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
          <H6 className={ContentsClass.ItemTitle}>Mount Image</H6>
          <Stack spacing={2} direction="row">
            <Button style={{ marginRight: 10 }} disabled={loading} onClick={mountDiskImage}>
              {loading ? 'Mounting Image' : 'Mount Image'}
            </Button>
            <Button disabled={loading} onClick={unmountVolume}>
              {loading ? 'Unmounting Image' : 'Unmount Image'}
            </Button>
          </Stack>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
