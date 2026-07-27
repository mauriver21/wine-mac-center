export type WineState = {
  repositoryDownloaded: boolean;
  loaders: {
    downloadingRepository: boolean;
    checkingRepository: boolean;
  };
};
