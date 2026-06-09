import { StyleSelector } from '@components/StyleSelector';
import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { Card, CardContent, Grid, Stack, Icon, H6, ContentsClass } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const StyleModule = () => {
  const { t } = useI18n();
  const { wineApp, signal, refresh, urls } = useWineAppContext() || {};

  return (
    <Card>
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={PaintBrushIcon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{t('style')}</H6>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <StyleSelector
              refreshImage={signal}
              iconURL={urls?.iconURL}
              artworkURL={urls?.artworkURL}
              launcherImgURL={urls?.launcherImgURL}
              onChangeIcon={async (file) => {
                file && wineApp?.saveAppIcon({ appIconFile: await file?.arrayBuffer() });
                refresh();
              }}
              onChangeArtWork={async (file) => {
                file && wineApp?.saveAppArtwork({ appArtWorkFile: await file?.arrayBuffer() });
                refresh();
              }}
              onChangeLauncherImg={async (file) => {
                file && wineApp?.saveAppLauncherImg({ launcherImgFile: await file?.arrayBuffer() });
                refresh();
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
