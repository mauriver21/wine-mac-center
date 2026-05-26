import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { createWineAppPipeline as baseCreateWineAppPipeline } from '@utils/createWineAppPipeline';
import { Body1, Dialog, Stack } from 'reactjs-shared-ui';
import { WineAppPipeline } from '@interfaces/WineAppPipeline';
import { FilePathInput } from '@components/FilePathInput';
import { FileFilter } from '@constants/enums';
import { useSteamCli } from '@hooks/useSteamCli';
import { createAria2cCli } from '@utils/createAria2cCli';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { Button } from '@components/Button';

export type WineAppPipelineContextType = {
  createWineAppPipeline: typeof baseCreateWineAppPipeline;
  getWineAppPipeline: () => WineAppPipeline | undefined;
  killWineAppPipeline: () => Promise<void | undefined>;
};

export const WineAppPipelineContext = createContext<WineAppPipelineContextType>({} as any);
export const useWineAppPipeline = () => useContext(WineAppPipelineContext);

export const withWineAppPipelineProvider = <T,>(Component: React.FC<T>) => {
  return (props: T & JSX.IntrinsicAttributes) => {
    const { t } = useI18n();
    const [openSelectExecutableDialog, setOpenSelectExecutableDialog] = useState(false);
    const [mainExePath, setMainExePath] = useState('');
    const steamCli = useSteamCli();
    const aria2cCli = useMemo(() => createAria2cCli(), []);

    const store = useRef<{
      pipeline: WineAppPipeline | undefined;
      mainExePath: string | undefined;
      intervalId?: NodeJS.Timeout;
      driveCPath: string;
    }>({ pipeline: undefined, mainExePath: undefined, driveCPath: '' });

    const mainExecutableSelection = () => {
      return new Promise<string>((resolve) => {
        store.current.intervalId = setInterval(() => {
          if (store.current.mainExePath !== undefined) {
            resolve(store.current.mainExePath);
          }
        }, 100);
      });
    };

    const resetMainExecutable = () => {
      clearInterval(store.current.intervalId);
      store.current.mainExePath = undefined;
      store.current.driveCPath = '';
    };

    const createWineAppPipeline: WineAppPipelineContextType['createWineAppPipeline'] = async (
      args
    ) => {
      const pipeline = await baseCreateWineAppPipeline({
        ...args,
        promptMainExeCallback: async ({ driveCPath }) => {
          store.current.driveCPath = driveCPath;
          setOpenSelectExecutableDialog(true);
          const mainExe = await mainExecutableSelection();
          resetMainExecutable();
          setOpenSelectExecutableDialog(false);
          return mainExe;
        },
        clients: { steamCli, aria2cCli }
      });

      store.current.pipeline = pipeline;
      return pipeline;
    };

    const getWineAppPipeline = () => store.current.pipeline;
    const killWineAppPipeline = async () => getWineAppPipeline()?.kill();

    return (
      <WineAppPipelineContext.Provider
        value={{
          createWineAppPipeline,
          getWineAppPipeline,
          killWineAppPipeline
        }}
      >
        <Component {...props} />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          fullWidth
          maxWidth="sm"
          open={openSelectExecutableDialog}
        >
          <Stack p={2} bgcolor="secondary.main" spacing={2}>
            <Body1 color="text.secondary">{t('selectTheMainExecutable')}</Body1>
            <FilePathInput
              filters={FileFilter.WindowsExecutables}
              defaultPath={store.current.driveCPath}
              relativeToDriveC
              onInput={(path) => {
                setMainExePath(path);
              }}
            />
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button
                onClick={() => {
                  store.current.mainExePath = '';
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  store.current.mainExePath = mainExePath;
                }}
              >
                Accept
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      </WineAppPipelineContext.Provider>
    );
  };
};
