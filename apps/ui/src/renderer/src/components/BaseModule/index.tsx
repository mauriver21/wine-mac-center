import { useWineAppContext } from '@hooks/useWineAppContext';
import { useI18n } from 'reactjs-shared-ui/i18next';
import React from 'react';
import {
  Box,
  ContentsClass,
  Card,
  CardContent,
  Stack,
  Icon,
  H6,
  Button,
  Body1
} from 'reactjs-shared-ui';

export interface BaseModuleProps {
  icon: React.FC;
  label: string;
  description: React.ReactNode;
  method: () => void;
}

export const BaseModule: React.FC<BaseModuleProps> = ({ icon, label, description, method }) => {
  const { t } = useI18n();
  const { wineApp, loading } = useWineAppContext() || {};

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={icon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{label}</H6>
            </Stack>
            <Box pr={2}>{description}</Box>
          </Stack>
          <Button
            title={t('run', { label })}
            disabled={wineApp === undefined || loading}
            color="secondary"
            sx={{
              width: 90,
              height: 60,
              border: (theme) => `1px solid ${theme.palette.primary.main}`
            }}
            onClick={() => method?.()}
          >
            <Body1>{t('run')}</Body1>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
