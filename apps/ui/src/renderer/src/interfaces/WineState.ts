export type WineState = {
  repositoryDownloaded: boolean;
  dependenciesInstallationOutput: string;
  wineTags: string[];
  selectedWineTag: string;
  wineCheckoutOutput: string;
  selectedWineArch: string;
  verifyBeforeBuild: boolean;
  wineBuildOutput: string;
  wineArchs: string[];
  loaders: {
    downloadingRepository: boolean;
    checkingRepository: boolean;
    installingDependencies: boolean;
    abortingDependenciesInstallation: boolean;
    listingTags: boolean;
    checkingOutTag: boolean;
    buildingWine: boolean;
    abortingWineBuild: boolean;
    listingArchs: boolean;
  };
};
