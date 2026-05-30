import { Body1, Box, H4, Icon, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { GithubIcon } from '@assets/icons/GithubIcon';
import { REPOSITORY_URL } from '@constants/urls';
import {
  CodeBracketIcon,
  Cog8ToothIcon,
  HeartIcon,
  WrenchIcon,
} from '@heroicons/react/16/solid';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const ContributingSection: React.FC = () => {
  const { t } = useI18n();

  const DEV_ITEMS = [
    { key: 'developedWithLoveForTheCommunity', icon: HeartIcon },
    { key: 'openSourceUnderMitLicense', icon: CodeBracketIcon },
    { key: 'madeWithReactTypescriptAndElectron', icon: Cog8ToothIcon },
    { key: 'designedForDevelopers', icon: WrenchIcon },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr 1fr"
      id="contributing"
      pb={4}
      columnGap={3}
    >
      <Stack spacing={1}>
        <H4 color="info.main" fontWeight="bold">
          {t('contributeToTheProject')}
        </H4>
        <Body1>{t('contributeDescription')}</Body1>
        <Button
          onClick={() => {
            window.open(REPOSITORY_URL, '_blank');
          }}
          sx={{ mt: 2 }}
        >
          <Icon render={GithubIcon} mr={1} /> {t('viewRepositoryOnGithub')}
        </Button>
      </Stack>
      <Stack spacing={2}>
        {DEV_ITEMS.map((item, index) => (
          <Stack key={index} direction="row" alignItems="center">
            <Icon size={28} render={item.icon} mr={1.5} />
            <Body1>{t(item.key)}</Body1>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
