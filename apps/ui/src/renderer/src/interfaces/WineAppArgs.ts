import { ConfigOrigin } from '@constants/enums';
import { WineAppConfig } from '@interfaces/WineAppConfig';

export type WineAppArgs = {
  origin: ConfigOrigin;
  appName: string | undefined;
  config?: WineAppConfig;
};
