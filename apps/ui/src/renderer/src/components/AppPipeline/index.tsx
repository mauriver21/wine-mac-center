import { PipelineStep } from '@components/PipelineStep';
import { ProcessStatus } from '@constants/enums';
import { RootState } from '@interfaces/RootState';
import { useAppModel } from '@models/useAppModel';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { alpha } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';

export const AppPipeline: React.FC = () => {
  const [resuming, setResuming] = useState(false);
  const [stopping, setStopping] = useState(false);
  const { appName } = useParams();
  const appModel = useAppModel();
  const wineAppPipelineModel = useWineAppPipelineModel();
  const installedAppModel = useWineInstalledAppModel();
  const navigate = useNavigate();
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const installedApp = useSelector((state: RootState) =>
    installedAppModel.selectWineInstalledApp(state, appName)
  );
  const wineAppPipelineStatus = useSelector(wineAppPipelineModel.selectWineAppPipelineStatus);
  const pipelineStatus = installedApp?.pipeline?.status;

  const runPipeline = async () => {
    try {
      setStopping(false);
      setResuming(true);
      if (appName === undefined) throw new Error(`Invalid application name`);
      await wineAppPipelineModel.runWineAppPipeline(appName);
      setResuming(false);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  const killPipeline = async () => {
    setStopping(true);
    await wineAppPipelineModel.killWineAppPipeline();
  };

  useEffect(() => {
    if (appName) {
      wineAppPipelineModel.runWineAppPipeline(appName);
    }
  }, [appName]);

  useEffect(() => {
    installedAppModel.listAll();
  }, [wineAppPipelineStatus?.status]);

  useEffect(() => {
    contentsAreaRef.current?.refreshTableOfContents();
  });

  return (
    <Box display="grid" overflow="auto">
      <ContentsArea
        ref={contentsAreaRef}
        style={{
          height: '100%',
          display: 'grid',
          overflow: 'auto',
          gridTemplateRows: 'auto 1fr'
        }}
      >
        <Box>
          <Box
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              boxShadow: (theme) => `inset 0 -1px ${theme.palette.secondary.main}`
            }}
          >
            <H6 color="text.secondary" fontWeight={500}>
              {appName}
            </H6>
          </Box>
          <Box
            sx={{
              height: '1px',
              boxShadow: (theme) => `inset 0 1px ${theme.palette.secondary.light}`
            }}
          ></Box>
        </Box>
        <Box display="grid" overflow="auto" gridTemplateRows="1fr auto">
          <Box display="grid" gridTemplateColumns="1fr 250px" overflow="auto">
            <Box
              overflow="auto"
              display="grid"
              gridTemplateRows="1fr auto"
              sx={{
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
                }
              }}
            >
              <Box p={2} overflow="auto">
                {wineAppPipelineStatus?.jobs?.map?.((item) => (
                  <Stack alignItems="center" key={item.name} spacing={2}>
                    {item?.steps?.map((step, index) => (
                      <Box key={index} width="100%" maxWidth={800} className={ContentsClass.Item}>
                        <PipelineStep step={step} />
                      </Box>
                    ))}
                  </Stack>
                ))}
              </Box>
              <Stack
                borderTop={(theme) => `1px solid ${theme.palette.secondary.light}`}
                p={2}
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                {wineAppPipelineStatus?.status === ProcessStatus.InProgress ? (
                  <Button
                    disabled={stopping}
                    sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                    color="secondary"
                    onClick={killPipeline}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                    color="secondary"
                    onClick={() => navigate('/scripts')}
                  >
                    Close
                  </Button>
                )}
                {pipelineStatus === ProcessStatus.Cancelled ? (
                  <Button
                    disabled={resuming}
                    sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                    color="secondary"
                    onClick={runPipeline}
                  >
                    Resume
                  </Button>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
            <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
              <TableOfContents pt={1} />
            </Box>
          </Box>
        </Box>
      </ContentsArea>
    </Box>
  );
};
