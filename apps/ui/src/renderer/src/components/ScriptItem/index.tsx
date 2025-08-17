import React from 'react';
import { Body1, Card, CardContent, Icon, Stack } from 'reactjs-shared-ui';
import { PencilSquareIcon, PlayCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button } from '@components/Button';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { WineAppConfig } from '@interfaces/WineAppConfig';

export interface ScriptItemProps {
  appConfig: WineAppConfig | undefined;
}

export const ScriptItem: React.FC<ScriptItemProps> = ({ appConfig }) => {
  const { navigateToAppPipelineByScriptKeyName } = useNavigateApp();

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" pt="5px" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              title="Run Script"
              onClick={() => navigateToAppPipelineByScriptKeyName(appConfig?.name)}
              equalSize={34}
              sx={{ borderRadius: '100%' }}
            >
              <Icon size={24} render={PlayCircleIcon} />
            </Button>
            <Body1>{appConfig?.name}</Body1>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button title="Edit Script" equalSize={34} sx={{ borderRadius: '100%' }}>
              <Icon size={24} render={PencilSquareIcon} />
            </Button>
            <Button title="Remove Script" equalSize={34} sx={{ borderRadius: '100%' }}>
              <Icon size={24} render={TrashIcon} />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
