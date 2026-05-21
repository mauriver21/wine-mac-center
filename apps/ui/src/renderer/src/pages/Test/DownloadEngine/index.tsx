import { useMemo, useState } from 'react';
import { useTestContext } from '@pages/Test';
import { Code } from '@components/Code';
import { findOutputPids } from '@utils/findOutputPids';
import { Body2, H6, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { useWineEngineModel } from '@models/useWineEngineModel';
import { useSelector } from 'react-redux';

export const DownloadEngine: React.FC = () => {
  const [engineVersion, setEngineVersion] = useState('WS11WineCX64Bit23.6.0');
  const [pids, setPids] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const { wineApp } = useTestContext();
  const wineEngineModel = useWineEngineModel();

  const wineEnginesDownloadables = useSelector(wineEngineModel.selectWineEnginesDownloadables);
  const engineURLs = useMemo(() => {
    const downloadables = wineEnginesDownloadables?.find((item) => item.version == engineVersion);
    return downloadables?.urls || [];
  }, [engineVersion]);

  const downloadEngine = async () => {
    setLoading(true);
    await wineApp.downloadWineEngine(engineURLs, engineVersion, {
      onStdOut: (data) => {
        console.log(data);
        const pids = findOutputPids(data);
        pids && setPids(pids);
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
    <Stack spacing={2}>
      <H6>Download Engine</H6>
      <Body2>PIDS: {pids ? pids : 'No pids available'}</Body2>
      <WineEnginesSelect
        value={engineVersion}
        onChange={(event) => {
          setEngineVersion(event.target.value as string);
        }}
      />
      <Button disabled={loading} onClick={downloadEngine}>
        {loading ? 'Downloading' : 'Download'} Engine
      </Button>
      <Code type="content" code={JSON.stringify(data, null, 2)} />
    </Stack>
  );
};
