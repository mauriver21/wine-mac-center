import { combineReducers as combineStates } from '@reduxjs/toolkit';
import { appState } from '@states/appState';
import { wineAppState } from '@states/wineAppState';
import { wineInstalledAppState } from '@states/wineInstalledAppState';
import { wineAppConfigState } from '@states/wineAppConfigState';
import { wineAppPipelineState } from '@states/wineAppPipelineState';
import { winetrickState } from '@states/winetrickState';
import { wineEngineState } from '@states/wineEngineState';
import { wineScriptState } from '@states/wineScriptState';

export const rootState = combineStates({
  appState,
  wineAppState,
  wineAppConfigState,
  wineAppPipelineState,
  wineInstalledAppState,
  winetrickState,
  wineEngineState,
  wineScriptState
});
