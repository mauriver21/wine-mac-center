import { ConfigOrigin } from '@constants/enums';
import { buildAppUrls } from '@utils/buildAppUrls';
import { fileExists } from '@utils/fileExists';
import { createObjectURL } from '@utils/createObjectURL';

export const buildAppObjectUrls = async (args: {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}) => {
  const urls = buildAppUrls(args);
  let hasIcon = false;
  let hasArtwork = false;
  let hasLauncherImg = false;

  if (urls?.iconURL) {
    hasIcon = await fileExists(urls?.iconURL);
  }

  if (urls?.artworkURL) {
    hasArtwork = await fileExists(urls?.artworkURL);
  }

  if (urls?.launcherImgURL) {
    hasLauncherImg = await fileExists(urls?.launcherImgURL);
  }

  return {
    artworkURL: hasArtwork ? await createObjectURL(urls?.artworkURL) : undefined,
    iconURL: hasIcon ? await createObjectURL(urls?.iconURL) : undefined,
    launcherImgURL: hasLauncherImg ? await createObjectURL(urls?.launcherImgURL) : undefined
  };
};
