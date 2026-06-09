import { ConfigOrigin } from '@constants/enums';
import { buildAppUrls } from '@utils/buildAppUrls';
import { fileExists } from '@utils/fileExists';
import { createObjectURL } from '@utils/createObjectURL';

export const buildAppObjectUrls = (args: {
  appName: string | undefined;
  origin: ConfigOrigin | undefined;
}) => {
  const urls = buildAppUrls(args);
  return new Promise<{ artworkURL?: string; iconURL?: string; launcherImgURL?: string }>(
    async (resolve) => {
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

      resolve({
        artworkURL: hasArtwork ? await createObjectURL(urls?.artworkURL) : undefined,
        iconURL: hasIcon ? await createObjectURL(urls?.iconURL) : undefined,
        launcherImgURL: hasLauncherImg ? await createObjectURL(urls?.launcherImgURL) : undefined
      });
    }
  );
};
