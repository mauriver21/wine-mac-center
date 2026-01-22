import { PipelineStep } from '@components/PipelineStep';
import { ConfigOrigin, PipelineAction, ProcessStatus } from '@constants/enums';
import { useQueryParam } from '@hooks/useQueryParam';
import { ConfigLayout } from '@layouts/ConfigLayout';
import { useAppModel } from '@models/useAppModel';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { useWineInstalledAppModel } from '@models/useWineInstalledAppModel';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, ContentsAreaHandle, ContentsClass, sleep, Stack } from 'reactjs-shared-ui';

export const AppPipeline: React.FC = () => {
  const [resuming, setResuming] = useState(false);
  const [stopping, setStopping] = useState(false);
  const { appName } = useParams();
  const queryParam = useQueryParam();
  const appModel = useAppModel();
  const origin = queryParam.get('origin') as ConfigOrigin;
  const action = queryParam.get('action') as PipelineAction;
  const wineAppPipelineModel = useWineAppPipelineModel();
  const installedAppModel = useWineInstalledAppModel();
  const navigate = useNavigate();
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const wineAppPipelineStatus = useSelector(wineAppPipelineModel.selectWineAppPipelineStatus);
  const status = wineAppPipelineStatus?.status;

  const resumePipeline = async () => {
    try {
      setStopping(false);
      setResuming(true);
      if (appName === undefined) throw new Error(`Invalid application name`);
      await wineAppPipelineModel.runWineAppPipeline({
        appName,
        origin: ConfigOrigin.INSTALLED_APP
      });
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setResuming(false);
    }
  };

  const killPipeline = async () => {
    setStopping(true);
    await wineAppPipelineModel.killWineAppPipeline();
    await sleep(200);
    await wineAppPipelineModel.loadWineAppPipeline(appName);
    setStopping(false);
  };

  useEffect(() => {
    if (appName) {
      switch (action) {
        case PipelineAction.RUN:
          wineAppPipelineModel.runWineAppPipeline({ appName, origin });
          break;
        case PipelineAction.RESUME:
          wineAppPipelineModel.loadWineAppPipeline(appName);
          break;
        default:
          break;
      }
    }
  }, [appName]);

  useEffect(() => {
    installedAppModel.listAll();
  }, [status]);

  useEffect(() => {
    contentsAreaRef.current?.refreshTableOfContents();
  }, [wineAppPipelineStatus?.jobs?.length]);

  return (
    <ConfigLayout
      mainTitle={appName}
      showBack={false}
      contentSlot={
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
      }
      actionsSlot={
        <>
          {status === ProcessStatus.InProgress ? (
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
              disabled={resuming}
              sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
              color="secondary"
              onClick={() => navigate('/apps')}
            >
              Close
            </Button>
          )}
          {status === ProcessStatus.Cancelled ? (
            <Button
              disabled={resuming}
              sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
              color="secondary"
              onClick={resumePipeline}
            >
              Resume
            </Button>
          ) : (
            <></>
          )}
        </>
      }
    />
  );
};
