import { StatusBox } from '@components/StatusBox';
import { RootState } from '@interfaces/RootState';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';
import { alpha } from '@mui/material';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Body1,
  Box,
  Button,
  Card,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-ui-core';

export const AppPipeline: React.FC = () => {
  const wineAppPipelineModel = useWineAppPipelineModel();
  const wineAppPipeline = useSelector((state: RootState) =>
    wineAppPipelineModel.selectWineAppPipelineWithMeta(state)
  );
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const { realAppName } = useParams();
  contentsAreaRef.current?.refreshTableOfContents();

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
              {realAppName}
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
              p={2}
              overflow="auto"
              display="grid"
              sx={{
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
                }
              }}
            >
              {wineAppPipeline.jobs?.map?.((item) => (
                <Stack alignItems="center" key={item.name} spacing={2}>
                  {item?.steps?.map((step, index) => (
                    <Box key={index} width="100%" maxWidth={800} className={ContentsClass.Item}>
                      <Card key={index}>
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            p={1}
                          >
                            <Body1
                              className={ContentsClass.ItemTitle}
                              fontWeight={500}
                              color="text.secondary"
                            >
                              {step.name}
                            </Body1>
                            <StatusBox status={step.status} />
                          </Stack>
                        </Stack>
                      </Card>
                    </Box>
                  ))}
                </Stack>
              ))}
            </Box>
            <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
              <TableOfContents pt={1} />
            </Box>
          </Box>
          <Stack
            borderTop={(theme) => `1px solid ${theme.palette.secondary.light}`}
            p={2}
            direction="row"
            spacing={1}
            justifyContent="flex-end"
          >
            <Button
              sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
              color="secondary"
              onClick={() => wineAppPipelineModel.killWineAppPipeline(wineAppPipeline.pipelineId)}
            >
              Kill
            </Button>
          </Stack>
        </Box>
      </ContentsArea>
    </Box>
  );
};
