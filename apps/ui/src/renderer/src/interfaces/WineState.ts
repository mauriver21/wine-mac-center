export type WineState = {
  repositoryDownloaded: boolean;
  dependenciesInstallationOutput: string;
  loaders: {
    downloadingRepository: boolean;
    checkingRepository: boolean;
    installingDependencies: boolean;
    abortingDependenciesInstallation: boolean;
  };
};
