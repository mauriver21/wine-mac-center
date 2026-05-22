import React, { useState } from 'react';
import { Button } from '@components/Button';
import { DialogProps, Dialog, Stack, Body1, Icon, H5 } from 'reactjs-shared-ui';
import { TextField } from '@mui/material';
import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { EventName } from '@constants/enums';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface SteamGuardCodeDialogProps extends DialogProps {
  loading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept: (guardCode: string) => void;
  onCancel: (eventName: EventName.Cancelled) => void;
}

export const SteamGuardCodeDialog: React.FC<SteamGuardCodeDialogProps> = ({
  setOpen,
  disableEscapeKeyDown,
  disableBackdropClick,
  loading,
  onAccept,
  onCancel,
  ...rest
}) => {
  const { t } = useI18n();
  const [guardCode, setGuardCode] = useState('');

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      fullWidth
      onClose={close}
      {...rest}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        bgcolor="secondary.main"
        p={2}
        spacing={2}
      >
        <Stack spacing={3} pb={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon render={SteamIcon} size={48} />
            <H5 color="text.secondary" fontWeight={500}>
              {t('steamGuard')}
            </H5>
          </Stack>
          <Body1 fontWeight={500}>
            {t('steamGuardPrompt')}
          </Body1>
          <TextField label={t('guardCode')} onChange={(event) => setGuardCode(event.target.value)} />
        </Stack>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            disabled={loading}
            onClick={() => {
              onCancel(EventName.Cancelled);
              setOpen(false);
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              onAccept(guardCode);
              setOpen(false);
            }}
          >
            {t('accept')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

