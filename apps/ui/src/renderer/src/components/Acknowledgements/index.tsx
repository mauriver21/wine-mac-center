import { InternetArchiveIcon } from '@assets/icons/24/outline/InternetArchiveIcon';
import { WineHqIcon } from '@assets/icons/24/outline/WineHqIcon';
import { CardItem } from '@components/CardItem';
import {
  COMMUNITY_URL,
  GCENX_REPOSITORY_URL,
  INTERNET_ARCHIVE_URL,
  WINE_HQ_URL,
  WINETRICKS_URL
} from '@constants/urls';
import { CodeBracketIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { useOpenExternal } from '@hooks/useOpenExternal';
import { Person } from '@mui/icons-material';
import { Stack, Body2, Icon } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const Acknowledgements: React.FC = () => {
  const { t } = useI18n();
  const { openExternal } = useOpenExternal();
  const COMMUNITY = [
    { label: t('wineProject'), icon: WineHqIcon, url: WINE_HQ_URL },
    { label: t('winetricksMaintainers'), icon: SparklesIcon, url: WINETRICKS_URL },
    { label: t('communityDistributions'), icon: Person, url: COMMUNITY_URL },
    {
      label: t('openSourceContributors'),
      icon: CodeBracketIcon,
      url: GCENX_REPOSITORY_URL
    },
    {
      label: t('internetArchive'),
      icon: InternetArchiveIcon,
      url: INTERNET_ARCHIVE_URL
    }
  ];

  return (
    <CardItem icon={UserGroupIcon} label={t('acknowledgements')}>
      <Stack spacing={2}>
        {COMMUNITY.map(({ label, icon, url }, index) => (
          <Stack
            style={{ cursor: 'pointer' }}
            direction="row"
            key={index}
            spacing={1}
            alignItems="center"
            onClick={() => {
              url && openExternal(url);
            }}
          >
            <Icon size={32} render={icon} />
            <Body2>{label}</Body2>
          </Stack>
        ))}
      </Stack>
    </CardItem>
  );
};
