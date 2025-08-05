import { Flatten } from '@interfaces/Flatten';
import { WineScriptState } from '@interfaces/WineScriptState';

export const listAll = (
  wineScripts: WineScriptState['wineScripts'],
  state: WineScriptState
): WineScriptState => {
  return { ...state, wineScripts };
};

export const patch = (
  keyName: string,
  wineScript: Partial<Flatten<WineScriptState['wineScripts']>>,
  state: WineScriptState
): WineScriptState => {
  return {
    ...state,
    wineScripts: state.wineScripts?.map((item) => {
      if (item.keyName === keyName) {
        return { ...item, ...wineScript };
      }
      return item;
    })
  };
};
