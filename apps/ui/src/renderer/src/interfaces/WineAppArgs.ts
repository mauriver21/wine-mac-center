import { ConfigOrigin } from '@constants/enums';
import { WineAppConfig } from '@interfaces/WineAppConfig';

export type WineAppArgs =
  | {
      origin: ConfigOrigin.CLOUD;
      appName: string;
    }
  | {
      origin: ConfigOrigin.SCRIPTS;
      appName: string;
    }
  | {
      origin: ConfigOrigin.INSTALLED_APP;
      appName: string;
      config: WineAppConfig;
    };
