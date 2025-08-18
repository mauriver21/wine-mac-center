export enum WinetrickActionType {
  LIST = 'WINETRICK:LIST',
  LOADING = 'WINETRICK:LOADING'
}

export enum WineEngineActionType {
  LIST = 'WINE_ENGINE:LIST',
  LIST_DOWNLOADABLES = 'WINE_ENGINE:LIST_DOWNLOADABLES',
  LOADING = 'WINE_ENGINE:LOADING'
}

export enum WineAppConfigActionType {
  LIST_ALL = 'WINE_APP_CONFIG:LIST_ALL',
  PATCH = 'WINE_APP_CONFIG:PATCH',
  SAVE = 'WINE_APP_CONFIG:SAVE'
}

export enum WineAppPipelineActionType {
  PATCH = 'WINE_APP_PIPELINE:PATCH',
  REMOVE = 'WINE_APP_PIPELINE:REMOVE'
}

export enum AppActionType {
  SHOW_MESSAGE = 'APP:SHOW_MESSAGE'
}

export enum WineInstalledAppActionType {
  LIST_ALL = 'WINE_INSTALLED_APP:LIST_ALL',
  PATCH = 'WINE_INSTALLED_APP:PATCH'
}
