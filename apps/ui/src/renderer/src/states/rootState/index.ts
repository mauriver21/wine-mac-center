import { combineReducers as combineStates } from '@reduxjs/toolkit';
import { appState } from '@states/appState';
import { wineInstalledAppState } from '@states/wineInstalledAppState';
import { wineAppConfigState } from '@states/wineAppConfigState';
import { wineAppPipelineState } from '@states/wineAppPipelineState';
import { winetrickState } from '@states/winetrickState';
import { wineEngineState } from '@states/wineEngineState';
import { persistedWineState } from '@states/wineState';

export const rootState = combineStates({
  appState,
  wineAppConfigState,
  wineAppPipelineState,
  wineInstalledAppState,
  winetrickState,
  wineEngineState,
  wineState: persistedWineState
});
