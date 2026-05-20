import { StatusBox } from '@components/StatusBox';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { WineAppStep } from '@interfaces/WineAppStep';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { Card, Stack, Body1, ContentsClass, Box, Icon } from 'reactjs-shared-ui';
import { Code } from 'reactjs-shared-ui/syntax-highlighter';
import { ContextMenu } from '@components/ContextMenu';
import { useAppPipelineContext } from '@hooks/useAppPipelineContext';
import { PipelineAction } from '@constants/enums';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface PipelineStepProps {
  step: WineAppStep;
  jobIndex: number;
  stepIndex: number;
}

export const PipelineStep: React.FC<PipelineStepProps> = ({ step, jobIndex, stepIndex }) => {
  const { t } = useI18n();
  const { runWineAppPipeline, running, action } = useAppPipelineContext();
  const [show, setShow] = useState(false);
  const output =
    step.output
      .replace(/\n{2,}/g, '\n')
      .replace(/^\n/g, '\n')
      .replace(/0$/g, '')
      .replace(/\[PID_START\].*?\[PID_END\]/g, '')
      .trim() || '\nNo output to display';
  const hasOutput = Boolean(step.output);

  return (
    <Card>
      <Stack width="100%" spacing={1} direction="row">
        <Box pl={1} display="flex" alignItems="center">
          <IconButton
            sx={{ opacity: hasOutput ? 1 : 0.5 }}
            disabled={!hasOutput}
            onClick={() => setShow((prev) => !prev)}
          >
            <Icon render={show ? ChevronDownIcon : ChevronRightIcon} />
          </IconButton>
        </Box>
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          pr={1.5}
        >
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={1}
          >
            <Body1 className={ContentsClass.ItemTitle} fontWeight={500} color="text.secondary">
              {t(step.name)}
            </Body1>
            <StatusBox status={step.status} />
          </Stack>
          {action === PipelineAction.RESUME ? (
            <ContextMenu
              disabled={running}
              menuItems={[
                {
                  label: t('runPipelineFromHere'),
                  onClick: () => {
                    runWineAppPipeline({ fromJobIndex: jobIndex, fromStepIndex: stepIndex });
                  }
                }
              ]}
            />
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
      {show ? (
        <Code
          sx={{
            '& > pre': { maxHeight: 200, overflowY: 'auto', overflowX: 'hidden !important' }
          }}
          type="content"
          language="bash"
          code={Boolean(output) ? output : t('No output to display')}
        />
      ) : (
        <></>
      )}
    </Card>
  );
};
