import { WineEnginesSelect } from '@components/WineEnginesSelect';
import { ExitCode } from '@constants/enums';
import { CpuChipIcon } from '@heroicons/react/24/solid';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useEffect, useState } from 'react';
import {
  Stack,
  Icon,
  H6,
  ContentsClass,
  Button,
  Body1,
  CardContent,
  Card
} from 'reactjs-shared-ui';

export const ChangeEngineModule: React.FC = () => {
  const { t } = useI18n();
  const { wineApp, loading, setLoading, refresh } = useWineAppContext() || {};
  const [engineVersion, setEngineVersion] = useState<string>('');
  const appConfig = wineApp?.getAppConfig();

  const changeWineEngine = async () => {
    setLoading?.(true);

    try {
      await new Promise((resolve, reject) => {
        wineApp?.extractEngine(engineVersion, {
          onStdOut: console.log,
          onStdErr: console.log,
          onExit: (output) => {
            if (output === ExitCode.Error) {
              reject(`Failed to Extract the Wine Engine ${engineVersion}`);
            }
            resolve(undefined);
          }
        });
      });

      await new Promise((resolve, reject) => {
        wineApp?.wineboot('', {
          onStdOut: console.log,
          onStdErr: console.log,
          onExit: (output) => {
            if (output === ExitCode.Error) {
              reject(`Failed to initialize the Wine Engine ${engineVersion}`);
            }
            resolve(undefined);
          }
        });
      });

      await wineApp?.readAppConfig();
      refresh?.();
    } finally {
      setLoading?.(false);
    }
  };

  useEffect(() => {
    if (appConfig?.engineVersion) {
      setEngineVersion(appConfig?.engineVersion);
    }
  }, [appConfig?.engineVersion]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" minWidth={210} pb={1}>
            <Icon strokeWidth={0} size={34} render={CpuChipIcon} pr={1} />
            <H6 className={ContentsClass.ItemTitle}>{t('changeEngine')}</H6>
          </Stack>
          <WineEnginesSelect
            value={engineVersion}
            onChange={(event) => setEngineVersion(event.target.value as string)}
          />
          <Stack width="100%" pt={1} alignItems="flex-end">
            <Button
              title={t('runChangeEngine')}
              disabled={wineApp === undefined || loading}
              color="secondary"
              sx={{
                width: 90,
                height: 60,
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }}
              onClick={changeWineEngine}
            >
              <Body1>{t('run')}</Body1>
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
