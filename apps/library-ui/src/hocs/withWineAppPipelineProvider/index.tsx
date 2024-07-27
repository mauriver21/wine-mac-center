import { createContext, useContext, useRef, useState } from 'react';
import { FilePath, WineAppPipeline } from 'neu-wine-api';
import { createWineAppPipeline as baseCreateWineAppPipeline } from '@utils';
import { Box, Button, Dialog, Select, Stack } from 'reactjs-ui-core';

export type WineAppPipelineContextType = {
  createWineAppPipeline: typeof baseCreateWineAppPipeline;
  findWineAppPipeline: (id: string | undefined) => WineAppPipeline | undefined;
  killWineAppPipeline: (id: string | undefined) => void;
};

export const WineAppPipelineContext = createContext<WineAppPipelineContextType>(
  {} as any,
);
export const useWineAppPipeline = () => useContext(WineAppPipelineContext);

export const withWineAppPipelineProvider = <T,>(Component: React.FC<T>) => {
  return (props: T & JSX.IntrinsicAttributes) => {
    const [openSelectExecutableDialog, setOpenSelectExecutableDialog] =
      useState(false);
    const [selectedExecutable, setSelectedExecutable] = useState('');
    const [executables, setExecutables] = useState<Array<FilePath>>([]);

    const store = useRef<{
      pipelines: Array<WineAppPipeline>;
      mainExePath: string;
      intervalId?: NodeJS.Timeout;
    }>({ pipelines: [], mainExePath: '' });

    const mainExecutableSelection = () => {
      return new Promise<string>((resolve) => {
        store.current.intervalId = setInterval(() => {
          if (store.current.mainExePath) {
            resolve(store.current.mainExePath);
          }
        }, 100);
      });
    };

    const resetMainExecutable = () => {
      setSelectedExecutable('');
      setExecutables([]);
      clearInterval(store.current.intervalId);
      store.current.mainExePath = '';
    };

    const createWineAppPipeline: WineAppPipelineContextType['createWineAppPipeline'] =
      async (args) => {
        const pipeline = await baseCreateWineAppPipeline({
          ...args,
          promptMainExeCallback: async (appExecutables) => {
            setExecutables(appExecutables);
            const mainExe = await mainExecutableSelection();
            resetMainExecutable();
            return mainExe;
          },
        });
        store.current.pipelines.push(pipeline);
        return pipeline;
      };

    const findWineAppPipeline = (id: string | undefined) =>
      store.current.pipelines.find((item) => item.id === id);

    const killWineAppPipeline = (id: string | undefined) => {
      const foundPipeline = findWineAppPipeline(id);
      foundPipeline?.kill();
    };

    return (
      <WineAppPipelineContext.Provider
        value={{
          createWineAppPipeline,
          findWineAppPipeline,
          killWineAppPipeline,
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
          <Box p={2} bgcolor="secondary.main">
            <Stack spacing={2}>
              <Select
                label="Select the main executable"
                options={executables.map((item) => ({
                  value: item.path,
                  label: item.name,
                }))}
                onChange={(event) =>
                  setSelectedExecutable(event.target.value as string)
                }
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  disabled={!selectedExecutable}
                  onClick={() => {
                    store.current.mainExePath = selectedExecutable;
                    setOpenSelectExecutableDialog(false);
                  }}
                >
                  Select
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Dialog>
      </WineAppPipelineContext.Provider>
    );
  };
};
