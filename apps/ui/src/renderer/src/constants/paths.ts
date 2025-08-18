import { ENV } from './envs';

export const WINE_APP_CONFIG_JSON_PATH = 'Config.app/Contents/Resources/data/config.json';
export const WINE_APP_PIPELINE_JSON_PATH = 'Config.app/Contents/Resources/data/pipeline.json';
export const DRIVE_C_PATH = 'drive_c';
export const WINE_PATH = '/Wine';
export const WINE_APPS_PATH = '/Wine/apps';
export const WINE_ENGINES_PATH = '/Wine/engines';
export const EXECUTABLES_PATHS: { [key: string]: string } = {
  '{{Steam}}': `${ENV.WINE_DOWNLOADS_PATH}/SteamSetup.exe`
};
