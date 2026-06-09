import { ConfigOrigin, FileName } from '@constants/enums';
import { v4 as uuid } from 'uuid';
import { ENV } from '@constants/envs';
import { WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { encodeURL } from '@utils/encodeURL';

export const buildAppUrls = (args: {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}) => {
  const { appName, origin } = args;

  switch (origin) {
    case ConfigOrigin.CLOUD: {
      const ASSETS_URL = `${WINE_APPS_CONFIGS_URL}/${appName}`;
      return {
        artworkURL: encodeURL(`${ASSETS_URL}/header.jpeg`),
        iconURL: encodeURL(`${ASSETS_URL}/${FileName.CFBundleIconFile}?cache=${uuid()}`),
        launcherImgURL: encodeURL(`${ASSETS_URL}/launcher.jpeg`),
        scriptURL: encodeURL(`${ASSETS_URL}/index.json`)
      };
    }
    case ConfigOrigin.SCRIPTS: {
      const SCRIPT_PATH = `${ENV.WINE_SCRIPTS_PATH}/${appName}`;
      return {
        artworkURL: encodeURL(`${SCRIPT_PATH}/header.jpeg`),
        iconURL: encodeURL(`${SCRIPT_PATH}/${FileName.CFBundleIconFile}`),
        launcherImgURL: encodeURL(`${SCRIPT_PATH}/launcher.jpeg`),
        scriptURL: encodeURL(`${SCRIPT_PATH}/index.json`)
      };
    }
    default:
      return;
  }
};
