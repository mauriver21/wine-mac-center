import {
  // Body1, Button, Card,
  Dialog,
  DialogProps,
  // H6,
  Stack
} from 'reactjs-shared-ui';
// import { useSelector } from 'react-redux';
// import { StatusBox } from '@components/StatusBox';
// import { RootState } from '@interfaces/RootState';
// import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';

export interface AppPipelineProps extends DialogProps {}

export const AppPipelineDialog: React.FC<AppPipelineProps> = (props) => {
  // const wineAppPipelineModel = useWineAppPipelineModel();
  // const wineAppPipeline = useSelector((state: RootState) =>
  //   wineAppPipelineModel.selectWineAppPipelineWithMeta(state)
  // );
  // const close = () => {
  //   wineAppPipelineModel.clearWineAppPipeline();
  // };

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown fullWidth maxWidth="lg" {...props}>
      <Stack p={2} spacing={2}>
        {/* <H6>{wineAppPipeline.meta.wineApp?.name}</H6>
        {wineAppPipeline.jobs?.map?.((item) => (
          <Stack key={item.name}>
            <Stack spacing={2}>
              {item?.steps?.map((step, index) => (
                <Card key={index}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                      <Body1 fontWeight={500} color="text.secondary">
                        {step.name}
                      </Body1>
                      <StatusBox status={step.status} />
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        ))}
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            color="error"
            onClick={() => wineAppPipelineModel.killWineAppPipeline(wineAppPipeline.pipelineId)}
          >
            Kill
          </Button>
          <Button color="info" onClick={close}>
            Close
          </Button>
        </Stack> */}
      </Stack>
    </Dialog>
  );
};
