import { Body2, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { CardItem } from '@components/CardItem';
import { CodeBracketSquareIcon } from '@heroicons/react/24/solid';
import { useOpenExternal } from '@hooks/useOpenExternal';
import { Button } from '@components/Button';
import { GithubIcon } from '@assets/icons/24/outline/GithubIcon';
import { REPOSITORY_URL } from '@constants/urls';

export const ProjectInfo: React.FC = () => {
  const { t } = useI18n();
  const { openExternal } = useOpenExternal();

  return (
    <CardItem icon={CodeBracketSquareIcon} label={t('projectInfo')}>
      <Stack spacing={2}>
        <Body2>{t('projectInfoLegend1')}</Body2>
        <Body2>{t('projectInfoLegend2')}</Body2>
        <Stack justifyContent="flex-end">
          <Button
            onClick={() => {
              openExternal(REPOSITORY_URL);
            }}
          >
            <Icon render={GithubIcon} mr={1} /> {t('viewRepositoryOnGithub')}
          </Button>
        </Stack>
      </Stack>
    </CardItem>
  );
};
