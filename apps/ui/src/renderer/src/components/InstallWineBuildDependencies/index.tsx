import { Button } from '@components/Button';
import { CardItem } from '@components/CardItem';
import { Code } from '@components/Code';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useWineModel } from '@models/useWineModel';
import { useSelector } from 'react-redux';
import { Body1, CircularProgress, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const InstallWineBuildDependencies: React.FC = () => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const output = useSelector(wineModel.selectDependenciesInstallationOutput);
  const { installingDependencies } = useSelector(wineModel.selectWineLoaders);
  const displayOutput = output.trim() || t('noOutputToDisplay');

  return (
    <CardItem icon={WrenchScrewdriverIcon} label={t('wineBuildDependencies')}>
      <Stack spacing={2}>
        <Body1 color="text.secondary">{t('wineBuildDependenciesDescription')}</Body1>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            disabled={installingDependencies}
            onClick={() => wineModel.installWineBuildDependencies()}
          >
            {installingDependencies ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress style={{ width: 18, height: 18 }} />
                <span>{t('installingDependencies')}</span>
              </Stack>
            ) : (
              t('installDependencies')
            )}
          </Button>
        </Stack>
        <Code type="content" code={displayOutput} />
      </Stack>
    </CardItem>
  );
};
