import { PipelineScript } from '@interfaces/PipelineScript';

export type WineScriptAppConfig = {
  id: string;
  appName: string;
  keyName: string;
  winetricks: { verbs: Array<string> };
  engineVersion: string;
  dxvkEnabled: boolean;
  setupExecutableURL: string;
  pipelineScripts?: Array<PipelineScript>;
  executables: [
    {
      main: boolean;
      path: string;
      flags: string;
    }
  ];
};
