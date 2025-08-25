import React, { useState } from 'react';
import { Body1, Card, CardContent, Icon, Stack } from 'reactjs-shared-ui';
import { PencilSquareIcon, PlayCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button } from '@components/Button';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';

export interface ScriptItemProps {
  appName: string;
}

export const ScriptItem: React.FC<ScriptItemProps> = ({ appName }) => {
  const { navigateToAppPipeline } = useNavigateApp();
  const [removing, setRemoving] = useState(false);
  const scriptModel = useWineAppConfigModel();

  const removeScript = async (appName: string) => {
    setRemoving(true);
    await scriptModel.remove(appName);
    setRemoving(false);
  };

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" pt="5px" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              title="Run Script"
              onClick={() =>
                navigateToAppPipeline(appName, {
                  origin: ConfigOrigin.SCRIPTS,
                  action: PipelineAction.RUN
                })
              }
              equalSize={34}
              sx={{ borderRadius: '100%' }}
            >
              <Icon size={24} render={PlayCircleIcon} />
            </Button>
            <Body1>{appName}</Body1>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button title="Edit Script" equalSize={34} sx={{ borderRadius: '100%' }}>
              <Icon size={24} render={PencilSquareIcon} />
            </Button>
            <Button
              disabled={removing}
              title="Remove Script"
              equalSize={34}
              sx={{ borderRadius: '100%' }}
              onClick={() => removeScript(appName)}
            >
              <Icon size={24} render={TrashIcon} />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
