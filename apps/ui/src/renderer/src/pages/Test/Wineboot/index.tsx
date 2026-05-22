import { useState } from 'react';
import { useTestContext } from '..';
import { Code } from '@components/Code';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';

export const Wineboot: React.FC = () => {
  const { wineApp } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const wineboot = async () => {
    setLoading(true);
    await wineApp.wineboot('', {
      onStdOut: (data) => {
        setData(data);
      },
      onStdErr: (data) => {
        setData(data);
      }
    });
    setLoading(false);
  };

  const winebootU = async () => {
    setLoading(true);
    await wineApp.wineboot('-u', {
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
          <H6 className={ContentsClass.ItemTitle}>Wineboot</H6>
          <Stack direction="row" spacing={2}>
            <Button disabled={loading} onClick={wineboot}>
              Wineboot
            </Button>
            <Button style={{ marginLeft: 10 }} disabled={loading} onClick={winebootU}>
              Wineboot -u
            </Button>
          </Stack>
          <Code type="content" code={JSON.stringify(data, null, 2)} />
        </Stack>
      </CardContent>
    </Card>
  );
};
