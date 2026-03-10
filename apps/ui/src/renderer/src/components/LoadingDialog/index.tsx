import React from 'react';
import { DialogProps, Dialog, Stack, Body1 } from 'reactjs-shared-ui';

export interface LoadingDialogProps extends DialogProps {
  message: string;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
  disableEscapeKeyDown,
  disableBackdropClick,
  loading,
  message,
  ...rest
}) => {
  return (
    <Dialog disableEscapeKeyDown disableBackdropClick fullWidth {...rest}>
      <Stack direction="column" justifyContent="space-between" bgcolor="secondary.main" p={2}>
        <Body1 fontWeight={500} py={3}>
          {message}
        </Body1>
      </Stack>
    </Dialog>
  );
};
