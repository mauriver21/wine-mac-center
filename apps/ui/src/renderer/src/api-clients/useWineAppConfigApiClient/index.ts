import { WineAppConfig } from '@interfaces/WineAppConfig';
import { WineAppConfigIndex } from '@interfaces/WineAppConfigIndex';
import { createDirectory } from '@utils/createDirectory';
import { dirExists } from '@utils/dirExists';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readDirectory } from '@utils/readDirectory';
import { readFileAsString } from '@utils/readFileAsString';
import { useEnv } from '@utils/useEnv';
import { writeFile } from '@utils/writeFile';

export const useWineAppConfigApiClient = () => {
  const env = useEnv();
  const WINE_SCRIPTS_PATH = env.get().WINE_SCRIPTS_PATH;
  const INDEX_PATH = `${WINE_SCRIPTS_PATH}/index.json`;

  const writeIndex = async (data: Array<WineAppConfigIndex>) =>
    writeFile(INDEX_PATH, JSON.stringify(data));

  const initIndex = async () => {
    if ((await fileExists(INDEX_PATH)) === false) {
      await writeIndex([]);
    }
  };

  const getIndex = async () => {
    return parseJson<Array<WineAppConfigIndex>>(await readFileAsString(INDEX_PATH));
  };

  const writeScript = async (data: WineAppConfig) => {
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.name}`;
    const config: WineAppConfig = {
      name: data.name,
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
    const promises: Array<Promise<WineAppConfig | undefined>> = [];
    let scripts: WineAppConfig[] = [];

    for (const dir of directories) {
      const SCRIPT_FILE = `${WINE_SCRIPTS_PATH}/${dir}/index.json`;
      const promise = new Promise<WineAppConfig | undefined>(async (resolve) => {
        let script = '';
        const hasScriptFile = await fileExists(SCRIPT_FILE);
        if (hasScriptFile) {
          script = await readFileAsString(SCRIPT_FILE);
          resolve(parseJson<WineAppConfig>(script));
        } else {
          resolve(undefined);
        }
      });
      promises.push(promise);
    }

    scripts = (await Promise.all(promises)).filter((item) => item !== undefined) as WineAppConfig[];

    return scripts;
  };

  const create = async (data: WineAppConfig) => {
    await initIndex();
    let index = (await getIndex()) || [];
    const SCRIPT_PATH = `${WINE_SCRIPTS_PATH}/${data.name}`;
    index = [
      ...index,
      {
        name: data.name
      }
    ];
    await writeIndex(index);

    if ((await dirExists(SCRIPT_PATH)) === false) {
      await createDirectory(SCRIPT_PATH);
      await writeScript(data);
    }
  };

  return {
    create,
    listAll
  };
};
