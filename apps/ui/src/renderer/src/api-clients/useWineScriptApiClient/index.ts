import { WineScriptAppConfig } from '@interfaces/WineScriptAppConfig';
import { WineScriptConfig } from '@interfaces/WineScriptConfig';
import { WineScriptIndexConfig } from '@interfaces/WineScriptIndexConfig';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { useEnv } from '@utils/useEnv';
import { writeFile } from '@utils/writeFile';

export const useWineScriptApiClient = () => {
  const env = useEnv();
  const WINE_SCRIPTS_PATH = env.get().WINE_SCRIPTS_PATH;
  const INDEX_PATH = `${WINE_SCRIPTS_PATH}/index.json`;

  const writeIndex = async (data: Array<WineScriptIndexConfig>) =>
    writeFile(INDEX_PATH, JSON.stringify(data));

  const initIndex = async () => {
    if ((await fileExists(INDEX_PATH)) === false) {
      await writeIndex([]);
    }
  };

  const getIndex = async () => {
    return parseJson<Array<WineScriptIndexConfig>>(await readFileAsString(INDEX_PATH));
  };

  const generateUniqueKeyName = (index: Array<WineScriptIndexConfig>, keyName: string) => {
    let number = 1;
    let newKeyname = keyName;

    while (index.some((item) => item.keyName == newKeyname)) {
      newKeyname = `${keyName}-${number}`;
      number++;
    }

    return newKeyname;
  };

  const writeScript = async (data: WineScriptConfig) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.keyName}`;
    const config: WineScriptAppConfig = {
      id: data.appConfigId,
      dxvkEnabled: data.dxvkEnabled || false,
      setupExecutableURL: '',
      engineVersion: data.engineVersion,
      winetricks: { verbs: [] },
      executables: [{ main: true, path: '', flags: '' }],
      pipelineScripts: data.pipelineScripts
    };

    writeFile(`${SCRIPT_PATH}/index.json`, JSON.stringify(config));
  };

  const listAll = async () => {
    const directories = await readDirectory(WINE_SCRIPTS_PATH);
    const promises: Array<Promise<WineScriptConfig | undefined>> = [];
    let scripts: WineScriptConfig[] = [];

    for (const dir of directories) {
      const SCRIPT_FILE = `${WINE_SCRIPTS_PATH}/${dir}/index.json`;
      const promise = new Promise<WineScriptConfig | undefined>(async (resolve) => {
        let script = '';
        const hasScriptFile = await fileExists(SCRIPT_FILE);
        if (hasScriptFile) {
          script = await readFileAsString(SCRIPT_FILE);
          resolve(parseJson<WineScriptConfig>(script));
        } else {
          resolve(undefined);
        }
      });
      promises.push(promise);
    }

    scripts = (await Promise.all(promises)).filter(
      (item) => item !== undefined
    ) as WineScriptConfig[];

    return scripts;
  };

  const create = async (data: WineScriptConfig) => {
    await initIndex();
    let index = (await getIndex()) || [];
    const keyName = generateUniqueKeyName(index, data.keyName);
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${keyName}`;
    index = [
      ...index,
      {
        appConfigId: data.appConfigId,
        keyName,
        name: data.appName,
        version: data.version
      }
    ];
    await writeIndex(index);

    if ((await dirExists(SCRIPT_PATH)) === false) {
      await createDirectory(SCRIPT_PATH);
      await writeScript({ ...data, keyName });
    }
  };

  return {
    create,
    listAll
  };
};
