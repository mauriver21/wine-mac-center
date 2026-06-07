import { ArtWorkInput } from '@components/ArtWorkInput';
import { IconInput } from '@components/IconInput';
import { LauncherImgInput } from '@components/LauncherImgInput';
import { fileToURL } from '@utils/fileToURL';
import { useState } from 'react';
import { Box } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface StyleSelectorProps {
  iconURL?: string;
  artworkURL?: string;
  launcherImgURL?: string;
  onChangeIcon?: (file: File | undefined) => void;
  onChangeArtWork?: (file: File | undefined) => void;
  onChangeLauncherImg?: (file: File | undefined) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  iconURL = '',
  artworkURL = '',
  launcherImgURL = '',
  onChangeIcon,
  onChangeArtWork,
  onChangeLauncherImg
}) => {
  const { t } = useI18n();
  const [iconSrc, setIconSrc] = useState(iconURL);
  const [artworkSrc, setArtWorkSrc] = useState(artworkURL);
  const [launcherImgSrc, setLauncherImgSrc] = useState(launcherImgURL);

  return (
    <Box pt={2} display="flex" gap={4} justifyContent="center">
      <IconInput
        type="image"
        imgSrc={iconSrc}
        onInput={async (file) => {
          onChangeIcon?.(file);
          file && setIconSrc(await fileToURL(file));
        }}
      />
      <ArtWorkInput
        type="image"
        imgSrc={artworkSrc}
        appName={t('noArtwork')}
        onInput={async (file) => {
          onChangeArtWork?.(file);
          file && setArtWorkSrc(await fileToURL(file));
        }}
      />
      <LauncherImgInput
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
