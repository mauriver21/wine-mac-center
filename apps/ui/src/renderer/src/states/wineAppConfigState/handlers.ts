import { Flatten } from '@interfaces/Flatten';
import { WineAppConfigState } from '@interfaces/WineAppConfigState';

export const listAll = (
  wineAppsConfigs: WineAppConfigState['wineAppsConfigs'],
  state: WineAppConfigState
): WineAppConfigState => {
  return { ...state, wineAppsConfigs };
};

export const create = (
  wineAppConfig: Flatten<WineAppConfigState['wineAppsConfigs']>,
  state: WineAppConfigState
): WineAppConfigState => {
  return { ...state, wineAppsConfigs: [...(state.wineAppsConfigs || []), wineAppConfig] };
};

export const update = (
  wineAppConfig: Flatten<WineAppConfigState['wineAppsConfigs']>,
  state: WineAppConfigState
): WineAppConfigState => {
  return {
    ...state,
    wineAppsConfigs: state?.wineAppsConfigs?.map((item) => {
      if (item.name == wineAppConfig.name && item.origin == wineAppConfig.origin) {
        return { ...item, ...wineAppConfig };
      }
      return item;
    })
  };
};

export const save = (
  wineAppConfig: Flatten<WineAppConfigState['wineAppsConfigs']>,
  state: WineAppConfigState
): WineAppConfigState => {
  const configExists = state.wineAppsConfigs?.some(
    (item) => item.name == wineAppConfig.name && item.origin == wineAppConfig.origin
  );

  if (configExists) {
    return update(wineAppConfig, state);
  } else {
    return create(wineAppConfig, state);
  }
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
