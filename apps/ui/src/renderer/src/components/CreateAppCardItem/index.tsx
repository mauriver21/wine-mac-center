import React from 'react';
import { Card, CardContent, Stack, Icon, H6, ContentsClass } from 'reactjs-ui-core';

export interface CreateAppCardItemProps {
  children?: React.ReactElement;
  label: string;
  icon: React.FC;
}

export const CreateAppCardItem: React.FC<CreateAppCardItemProps> = ({ children, label, icon }) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={icon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{label}</H6>
            </Stack>
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};
