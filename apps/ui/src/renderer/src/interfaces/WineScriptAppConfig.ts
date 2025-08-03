export type WineScriptAppConfig = {
  id: string;
  winetricks: { verbs: Array<string> };
  engineVersion: string;
  dxvkEnabled: boolean;
  setupExecutableURL: string;
  executables: [
    {
      main: boolean;
      path: string;
      flags: string;
    }
  ];
};
