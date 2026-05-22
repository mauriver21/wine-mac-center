import { useState } from 'react';
import { Code } from '@components/Code';
import { useTestContext } from '..';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const EnableDxvk: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const enableDxvk = async () => {
    setLoading(true);
    await wineApp.winetrick(
      { verb: 'dxvk1102', version: '20260125' },
      {
        onStdOut: (data) => {
          setData(data);
        },
        onStdErr: (data) => {
          setData(data);
        }
      }
    );
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <H6 className={ContentsClass.ItemTitle}>EnableDxvk</H6>
          <Button disabled={loading} onClick={enableDxvk}>
            EnableDxvk
          </Button>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
