import { Winetrick } from '@interfaces/Winetrick';
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

  const execScript = async (args: string) =>
    execCommand(`"${env.get().SCRIPTS_PATH}/winetricks.sh" ${args}`);

  const getWinetricks = async (cmd: string) => {
    const { stdOut, stdErr } = await execScript(cmd);
    console.warn(stdErr);
    return mapResponse(stdOut);
  };

  const help = () => {
    return execScript('--help');
  };

  const listApps = async () => {
    return getWinetricks('apps list');
  };

  const listBenchmarks = async () => {
    return getWinetricks('benchmarks list');
  };

  const listDlls = async () => {
    return getWinetricks('dlls list');
  };

  const listFonts = async () => {
    return getWinetricks('fonts list');
  };

  const listSettings = () => {
    return getWinetricks('settings list');
  };

  const listAll = async (options?: { force?: boolean }) => {
    const WINE_ASSETS_PATH = env.get().WINE_ASSETS_PATH;
    const WINETRICKS_PATH = `${WINE_ASSETS_PATH}/winetricks.json`;

    let winetricks: Winetricks = {
      apps: [],
      dlls: [],
      fonts: [],
      settings: []
    };

    if (!(await dirExists(WINE_ASSETS_PATH))) {
      await createDirectory(WINE_ASSETS_PATH);
    }

    if (!(await fileExists(WINETRICKS_PATH)) || options?.force) {
      const promises = await Promise.all([
        await listApps(),
        await listDlls(),
        await listFonts(),
        await listSettings()
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
