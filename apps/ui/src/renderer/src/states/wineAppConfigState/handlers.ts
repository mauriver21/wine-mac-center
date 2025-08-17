import { Flatten } from '@interfaces/Flatten';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';

export const patch = (
  wineAppConfig: Flatten<WineAppConfigState['wineAppsConfigs']>,
  state: WineAppConfigState
): WineAppConfigState => {
  if (state?.wineAppsConfigs?.some((item) => item.name == wineAppConfig.name)) {
    return {
      ...state,
      wineAppsConfigs: state.wineAppsConfigs.map((item) => {
        if (item.name == wineAppConfig.name) {
          return {
            ...item,
            ...wineAppConfig
          };
        }
        return item;
      })
    };
  } else {
    return {
      ...state,
      wineAppsConfigs: [...(state.wineAppsConfigs || []), wineAppConfig]
    };
  }
};
