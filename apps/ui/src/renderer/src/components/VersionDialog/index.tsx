import { Button } from '@components/Button';
import { VersionDialogAction } from '@constants/enums';
import { useVersionDialog } from '@hooks/useVersionDialog';
import React from 'react';
import { DialogProps, Dialog, Stack, Body1 } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface VersionDialogProps extends DialogProps {
  message: string;
  action: VersionDialogAction;
}

export const VersionDialog: React.FC<VersionDialogProps> = ({
  disableEscapeKeyDown,
  disableBackdropClick,
  message,
  action,
  ...rest
}) => {
  const { t } = useI18n();
  const dialog = useVersionDialog();

  return (
    <Dialog disableEscapeKeyDown disableBackdropClick fullWidth {...rest}>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="secondary.main"
        p={2}
      >
        <Body1 textAlign="center" fontWeight={500} py={3}>
          {message}
        </Body1>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
          {action === VersionDialogAction.Download && (
            <>
              <Button onClick={dialog.close}>{t('cancel')}</Button>
              <Button onClick={dialog.close}>{t('download')}</Button>
            </>
          )}
          {action === VersionDialogAction.None && (
            <>
              <Button onClick={dialog.close}>{t('close')}</Button>
            </>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};
