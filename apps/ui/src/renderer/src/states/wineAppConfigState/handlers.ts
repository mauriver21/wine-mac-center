import { Flatten } from '@interfaces/Flatten';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';

export const listAll = (
  wineAppsConfigs: WineAppConfigState['wineAppsConfigs'],
  state: WineAppConfigState
): WineAppConfigState => {
  return { ...state, wineAppsConfigs };
};

export const patch = (
  name: string,
  wineAppConfig: Partial<Flatten<WineAppConfigState['wineAppsConfigs']>>,
  state: WineAppConfigState
): WineAppConfigState => {
  return {
    ...state,
    wineAppsConfigs: state.wineAppsConfigs?.map((item) => {
      if (item.name === name) {
        return { ...item, ...wineAppConfig };
      }
      return item;
    })
  };
};
