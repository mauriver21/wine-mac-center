import { Body1, Box, H4, H5, Image, Stack } from 'reactjs-shared-ui';
import AppCards from '@assets/imgs/apps-cards.png';
import ScriptWindow from '@assets/imgs/script-window.png';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const ScriptsSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <Stack spacing={3} id="scripts">
      <Stack p={2} spacing={2}>
        <H5 textAlign="center" fontWeight="bold">
          {t('onlineScriptsLibrary')}
        </H5>
        <Body1 textAlign="center">
          {t('downloadCommunityOpenScripts')}
        </Body1>
        <Box>
          <Image src={AppCards} />
        </Box>
      </Stack>
      <Box display="grid" gridTemplateColumns="2fr 1.5fr">
        <Box>
          <Image style={{ marginTop: -17 }} width="100%" src={ScriptWindow} />
        </Box>
        <Stack p={2} spacing={2}>
          <H4>
            <H4 component="span" color="info" fontWeight="bold">
              {t('createYourOwnScripts')}
            </H4>{' '}
            {t('toAutomateApplicationInstallation')}
          </H4>
          <Body1>
            {t('easilyManageWineEngines')}
          </Body1>
        </Stack>
      </Box>
    </Stack>
  );
};
