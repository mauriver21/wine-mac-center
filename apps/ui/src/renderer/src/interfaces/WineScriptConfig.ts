import { PipelineScript } from '@interfaces/PipelineScript';

export type WineScriptConfig = {
  appConfigId: string;
  keyName: string;
  dxvkEnabled: boolean;
  appName: string;
  engineVersion: string;
  version: string;
  winetricksVerbs?: Array<string | undefined>;
  pipelineScripts?: Array<PipelineScript>;
};
