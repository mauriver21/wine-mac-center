import React from 'react';
import { Button } from '@components/Button';
import { DialogProps, Dialog, Stack, Body1 } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useVersionDialog } from '@hooks/useVersionDialog';
import { VersionDialogAction } from '@constants/enums';
import { useOpenExternal } from '@hooks/useOpenExternal';
import { RELEASE_URL } from '@constants/urls';

export interface VersionDialogProps extends DialogProps {
  message: string;
  action: VersionDialogAction;
  version: string;
}

export const VersionDialog: React.FC<VersionDialogProps> = ({
  disableEscapeKeyDown,
  disableBackdropClick,
  message,
  action,
  version,
  ...rest
}) => {
  const { t } = useI18n();
  const dialog = useVersionDialog();
  const { openExternal } = useOpenExternal();

  return (
    <Dialog disableEscapeKeyDown disableBackdropClick fullWidth {...rest}>
      <Stack spacing={1} p={1} bgcolor="secondary.main">
        <Stack direction="column" alignItems="center" p={2}>
          <Body1 textAlign="center" fontWeight={500} py={3}>
            {message}
          </Body1>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
          {action === VersionDialogAction.Download && (
            <>
              <Button onClick={dialog.close}>{t('cancel')}</Button>
              <Button
                onClick={() => {
                  openExternal(`${RELEASE_URL}/${version}`);
                  dialog.close();
                }}
              >
                {t('download')}
              </Button>
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
