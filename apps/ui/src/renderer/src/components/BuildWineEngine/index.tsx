import { Button } from '@components/Button';
import { CardItem } from '@components/CardItem';
import { Code } from '@components/Code';
import { WineArchSelect } from '@components/WineArchSelect';
import { CpuChipIcon, StopIcon } from '@heroicons/react/24/solid';
import { useWineModel } from '@models/useWineModel';
import { useSelector } from 'react-redux';
import { CircularProgress, Stack } from 'reactjs-shared-ui';
import { FormControlLabel, Switch } from '@mui/material';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const BuildWineEngine: React.FC = () => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const selectedWineTag = useSelector(wineModel.selectSelectedWineTag);
  const selectedWineArch = useSelector(wineModel.selectSelectedWineArch);
  const wineBuildOutput = useSelector(wineModel.selectWineBuildOutput);
  const verifyBeforeBuild = useSelector(wineModel.selectVerifyBeforeBuild);
  const {
    abortingWineBuild,
    buildingWine,
    checkingOutTag,
    installingDependencies,
    listingArchs
  } = useSelector(wineModel.selectWineLoaders);
  const conflictingOperation = checkingOutTag || installingDependencies || listingArchs;

  return (
    <CardItem icon={CpuChipIcon} label={t('buildWineEngine')}>
      <Stack spacing={2}>
        <WineArchSelect disabled={buildingWine || conflictingOperation} />
        <FormControlLabel
          control={
            <Switch
              checked={verifyBeforeBuild}
              disabled={buildingWine || conflictingOperation}
              onChange={(_, checked) => wineModel.setVerifyBeforeBuild(checked)}
            />
          }
          label={t('verifyBeforeCompilation')}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button            
            disabled={abortingWineBuild || conflictingOperation || !selectedWineTag}
            onClick={() =>
              buildingWine
                ? wineModel.abortWineBuild()
                : wineModel.buildWine(selectedWineTag, selectedWineArch, verifyBeforeBuild)
            }
          >
            {abortingWineBuild ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress style={{ width: 18, height: 18 }} />
                <span>{t('abortingWineBuild')}</span>
              </Stack>
            ) : buildingWine ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <StopIcon width={18} />
                <span>{t('abortWineBuild')}</span>
              </Stack>
            ) : (
              t('buildWineEngine')
            )}
          </Button>
        </Stack>
        <Code type="content" code={wineBuildOutput.trim() || t('noOutputToDisplay')} />
      </Stack>
    </CardItem>
  );
};
