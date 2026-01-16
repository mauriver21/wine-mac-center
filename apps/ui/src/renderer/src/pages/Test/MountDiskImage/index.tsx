import { useState } from 'react';
import { useWineAppContext } from '..';
import { Code } from '@components/Code';
import { useEnv } from '@hooks/useEnv';

export const MountDiskImage: React.FC = () => {
  const { wineApp } = useWineAppContext();
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
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3>Mount Image</h3>
        <hr />
      </div>
      <button style={{ marginRight: 10 }} disabled={loading} onClick={mountDiskImage}>
        {loading ? 'Mounting Image' : 'Mount Image'}
      </button>
      <button disabled={loading} onClick={unmountVolume}>
        {loading ? 'Unmounting Image' : 'Unmount Image'}
      </button>
      <Code label="Output" content={JSON.stringify(data, null, 2)} />
    </div>
  );
};
