import { ArtWorkInput } from '@components/ArtWorkInput';
import { IconInput } from '@components/IconInput';
import { LauncherImgInput } from '@components/LauncherImgInput';
import { fileToURL } from '@utils/fileToURL';
import { useEffect, useState } from 'react';
import { Box } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface StyleSelectorProps {
  iconURL?: string;
  artworkURL?: string;
  launcherImgURL?: string;
  onChangeIcon?: (file: File | undefined) => void;
  onChangeArtWork?: (file: File | undefined) => void;
  onChangeLauncherImg?: (file: File | undefined) => void;
  refreshImage?: number;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  iconURL,
  artworkURL,
  launcherImgURL,
  onChangeIcon,
  onChangeArtWork,
  onChangeLauncherImg,
  refreshImage
}) => {
  const { t } = useI18n();
  const [iconSrc, setIconSrc] = useState('');
  const [artworkSrc, setArtWorkSrc] = useState('');
  const [launcherImgSrc, setLauncherImgSrc] = useState('');

  useEffect(() => {
    iconURL !== undefined && setIconSrc(iconURL);
  }, [iconURL]);

  useEffect(() => {
    artworkURL !== undefined && setArtWorkSrc(artworkURL);
  }, [artworkURL]);

  useEffect(() => {
    launcherImgURL !== undefined && setLauncherImgSrc(launcherImgURL);
  }, [launcherImgURL]);

  return (
    <Box display="flex" gap={4} justifyContent="center">
      <IconInput
        refreshImage={refreshImage}
        type="image"
        imgSrc={iconSrc}
        onInput={async (file) => {
          onChangeIcon?.(file);
          file && setIconSrc(await fileToURL(file));
        }}
      />
      <ArtWorkInput
        refreshImage={refreshImage}
        type="image"
        imgSrc={artworkSrc}
        appName={t('noArtwork')}
        onInput={async (file) => {
          onChangeArtWork?.(file);
          file && setArtWorkSrc(await fileToURL(file));
        }}
      />
      <LauncherImgInput
        refreshImage={refreshImage}
        type="image"
        imgSrc={launcherImgSrc}
        appName={t('noLauncherImage')}
        onInput={async (file) => {
          onChangeLauncherImg?.(file);
          file && setLauncherImgSrc(await fileToURL(file));
        }}
      />
    </Box>
  );
};
