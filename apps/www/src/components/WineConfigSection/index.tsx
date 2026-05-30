import { Body1, Box, H4, Image, Stack } from 'reactjs-shared-ui';
import ScriptWindow from '@assets/imgs/app-config-window.png';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const WineConfigSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <Stack spacing={3} id="wine-config">
      <Box display="grid" gridTemplateColumns="1.5fr 2fr">
        <Stack p={2} spacing={2}>
          <H4>
            <H4 component="span" color="info" fontWeight="bold">
              {t('applyWineConfigurations')}
            </H4>{' '}
            {t('easilyOnEachOfYourApps')}
          </H4>
          <Body1>
            {t('customizeSpecificParameters')}
          </Body1>
        </Stack>
        <Box>
          <Image style={{ marginTop: -17 }} width="100%" src={ScriptWindow} />
        </Box>
      </Box>
    </Stack>
  );
};
