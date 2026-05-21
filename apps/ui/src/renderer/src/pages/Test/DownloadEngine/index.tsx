import { useState } from 'react';
import { useTestContext } from '@pages/Test';
import { Code } from '@components/Code';
import { findOutputPids } from '@utils/findOutputPids';

const ENGINES_URLS = {
  'WS11WineCX64Bit23.6.0': [
    'https://raw.githubusercontent.com/webblocksapp/wine-mac-center/master/packages/wine-apps-configs/src/downloadables/engines/WS11WineCX64Bit23.6.0/WS11WineCX64Bit23.6.0.tar_part.7z.001',
    'https://raw.githubusercontent.com/webblocksapp/wine-mac-center/master/packages/wine-apps-configs/src/downloadables/engines/WS11WineCX64Bit23.6.0/WS11WineCX64Bit23.6.0.tar_part.7z.002',
    'https://raw.githubusercontent.com/webblocksapp/wine-mac-center/master/packages/wine-apps-configs/src/downloadables/engines/WS11WineCX64Bit23.6.0/WS11WineCX64Bit23.6.0.tar_part.7z.003',
    'https://raw.githubusercontent.com/webblocksapp/wine-mac-center/master/packages/wine-apps-configs/src/downloadables/engines/WS11WineCX64Bit23.6.0/WS11WineCX64Bit23.6.0.tar_part.7z.004'
  ]
};

export const DownloadEngine: React.FC = () => {
  const { wineApp } = useTestContext();
  const [pids, setPids] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const downloadEngine = async () => {
    const ENGINE_VERSION = 'WS11WineCX64Bit23.6.0';

    setLoading(true);
    await wineApp.downloadWineEngine(ENGINES_URLS[ENGINE_VERSION], ENGINE_VERSION, {
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
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>Download Engine</h3>
        <hr />
      </div>
      <p>PIDS: {pids}</p>
      <button disabled={loading} onClick={downloadEngine}>
        {loading ? 'Downloading' : 'Download'} Engine
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
