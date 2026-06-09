import { ConfigOrigin, FileName } from '@constants/enums';
import { ENV } from '@constants/envs';
import { WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { encodeURL } from '@utils/encodeURL';

export const buildAppUrls = (args: {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}) => {
  const { appName, origin } = args;
  let assetsPath = '';

  switch (origin) {
    case ConfigOrigin.CLOUD: {
      assetsPath = `${WINE_APPS_CONFIGS_URL}/${appName}`;
      break;
    }
    case ConfigOrigin.SCRIPTS: {
      assetsPath = `${ENV.WINE_SCRIPTS_PATH}/${appName}`;
      break;
    }
    default:
      break;
  }

  return {
    artworkURL: encodeURL(`${assetsPath}/header.jpeg`),
    iconURL: encodeURL(`${assetsPath}/${FileName.CFBundleIconFile}`),
    launcherImgURL: encodeURL(`${assetsPath}/launcher.jpeg`),
    scriptURL: encodeURL(`${assetsPath}/index.json`)
  };
};
