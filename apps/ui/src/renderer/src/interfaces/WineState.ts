export type WineState = {
  repositoryDownloaded: boolean;
  dependenciesInstallationOutput: string;
  wineTags: string[];
  selectedWineTag: string;
  wineCheckoutOutput: string;
  loaders: {
    downloadingRepository: boolean;
    checkingRepository: boolean;
    installingDependencies: boolean;
    abortingDependenciesInstallation: boolean;
    listingTags: boolean;
    checkingOutTag: boolean;
  };
};
