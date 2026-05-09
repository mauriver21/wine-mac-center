import { Winetrick } from '@interfaces/Winetrick';
import { WinetrickCmd } from '@interfaces/WinetrickCmd';
import { Winetricks } from '@interfaces/Winetricks';
import { createDirectory } from '@utils/createDirectory';
import { createEnv } from '@utils/createEnv';
import { dirExists } from '@utils/dirExists';
import { execCommand } from '@utils/execCommand';
import { fileExists } from '@utils/fileExists';
import { parseJson } from '@utils/parseJson';
import { readFileAsString } from '@utils/readFileAsString';
import { writeFile } from '@utils/writeFile';

export const useWinetrickApiClient = () => {
  const env = createEnv();
  const mapResponse = (data: string = ''): Winetrick[] => {
    const mappedData: Winetrick[] = [];
    const rows = data.split('\n');
    for (const row of rows) {
      if (!row) continue;
      const [verb, description] = row.replace(/\s/, '--_--').split('--_--');

      mappedData.push({
        verb,
        description: description?.replace?.(/^\s+/, '')
      });
    }
    return mappedData;
  };

  const execScript = async (args: WinetrickCmd) => {
    const { cmd, version } = args;
    return execCommand(`"${env.get().SCRIPTS_PATH}/winetricks_${version}.sh" ${cmd}`);
  };

  const getWinetricks = async (args: WinetrickCmd) => {
    const { cmd, version } = args;
    const { stdOut, stdErr } = await execScript({ cmd, version });
    console.warn(stdErr);
    return mapResponse(stdOut);
  };

  const help = (version: string) => {
    return execScript({ cmd: '--help', version });
  };

  const listApps = async (version: string) => {
    return getWinetricks({ cmd: 'apps list', version });
  };

  const listBenchmarks = async (version: string) => {
    return getWinetricks({ cmd: 'benchmarks list', version });
  };

  const listDlls = async (version: string) => {
    return getWinetricks({ cmd: 'dlls list', version });
  };

  const listFonts = async (version: string) => {
    return getWinetricks({ cmd: 'fonts list', version });
  };

  const listSettings = (version: string) => {
    return getWinetricks({ cmd: 'settings list', version });
  };

  const listAll = async (params: { version: string; force?: boolean }) => {
    const WINE_ASSETS_PATH = env.get().WINE_ASSETS_PATH;
    const WINETRICKS_VERSION = params.version;
    const WINETRICKS_FOLDER_PATH = `${WINE_ASSETS_PATH}/winetricks/${WINETRICKS_VERSION}`;
    const WINETRICKS_PATH = `${WINETRICKS_FOLDER_PATH}/index.json`;

    let winetricks: Winetricks = {
      apps: [],
      dlls: [],
      fonts: [],
      settings: []
    };

    if (!(await dirExists(WINETRICKS_FOLDER_PATH))) {
      await createDirectory(WINETRICKS_FOLDER_PATH, { recursive: true });
    }

    if (!(await fileExists(WINETRICKS_PATH)) || params?.force) {
      const promises = await Promise.all([
        await listApps(WINETRICKS_VERSION),
        await listDlls(WINETRICKS_VERSION),
        await listFonts(WINETRICKS_VERSION),
        await listSettings(WINETRICKS_VERSION)
      ]);

      const [apps, dlls, fonts, settings] = promises;
      winetricks = { apps, dlls, fonts, settings };
      await writeFile(WINETRICKS_PATH, JSON.stringify(winetricks));
    } else {
      winetricks = {
        ...winetricks,
        ...parseJson<Winetricks>(await readFileAsString(WINETRICKS_PATH))
      };
    }

    return winetricks;
  };

  return {
    help,
    listAll,
    listApps,
    listBenchmarks,
    listDlls,
    listFonts,
    listSettings
  };
};
