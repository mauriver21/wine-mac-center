import { useMemo } from 'react';
import { Card, CardContent, ContentsClass, H6, Stack } from 'reactjs-shared-ui';
import { createAria2cCli } from '@utils/createAria2cCli';
import { spawnLog } from '@utils/spawnLog';
import { Button } from '@components/Button';

export const Aria2cCli: React.FC = () => {
  const aria2cCli = useMemo(() => createAria2cCli(), []);

  const download = () => {
    aria2cCli.download(
      {
        url: 'https://archive.org/download/pop-cap-game-collection-2010/PopCap_Game_Collection.iso'
      },
      spawnLog
    );
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <H6 className={ContentsClass.ItemTitle}>Aria2cCli</H6>
          <Stack spacing={1} direction="row">
            <Button onClick={download}>Download</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
