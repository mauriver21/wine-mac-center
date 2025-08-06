import React from 'react';
import { WineScriptConfig } from '@interfaces/WineScriptConfig';
import { Body1, Card, CardContent, Icon, Stack } from 'reactjs-ui-core';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@mui/material';

export interface ScriptItemProps {
  wineScript: WineScriptConfig | undefined;
}

export const ScriptItem: React.FC<ScriptItemProps> = ({ wineScript }) => {
  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" pt="5px" justifyContent="space-between">
          <Body1>{wineScript?.appName}</Body1>
          <Stack direction="row" alignItems="center">
            <IconButton>
              <Icon size={28} render={PlayCircleIcon} />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
