import { useState } from 'react';
import { Code } from '@components/Code';
import { useTestContext } from '..';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';

export const WineCfg: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const bundleApp = async () => {
    setLoading(true);
    await wineApp.winecfg({
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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>EnableDxvk</H6>
          <button disabled={loading} onClick={bundleApp}>
            winecfg
          </button>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
