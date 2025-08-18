import { WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { encodeURL } from '@utils/encodeURL';
import { v4 as uuid } from 'uuid';

export const buildAppUrls = (appName: string | undefined) => {
  const URL = `${WINE_APPS_CONFIGS_URL}/${appName}`;
  const ASSETS_URL = `${URL}/assets`;
  return {
    artworkURL: encodeURL(`${ASSETS_URL}/header.jpeg`),
    iconURL: encodeURL(`${ASSETS_URL}/winemacapp.icns?cache=${uuid()}`),
    scriptUrl: encodeURL(`${URL}/index.json`)
  };
};
