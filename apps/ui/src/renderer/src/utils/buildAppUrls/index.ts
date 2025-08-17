import { WINE_APPS_CONFIGS_URL } from '@constants/urls';
import { WineAppConfig } from '@interfaces/WineAppConfig';
import { encodeURL } from '@utils/encodeURL';
import { v4 as uuid } from 'uuid';

export const buildAppUrls = (appConfig?: WineAppConfig) => {
  const URL = `${WINE_APPS_CONFIGS_URL}/${appConfig?.name || ''}`;
  const ASSETS_URL = `${URL}/assets`;
  return {
    imgSrc: encodeURL(`${ASSETS_URL}/header.jpeg`),
    iconURL: encodeURL(`${ASSETS_URL}/winemacapp.icns?cache=${uuid()}`),
    scriptUrl: encodeURL(`${URL}/index.json`)
  };
};
