import React from 'react';
import { DialogProps, Dialog, Stack, Body1, CircularProgress, Box } from 'reactjs-shared-ui';

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
        <CircularProgress sx={{ width: 18, height: 18 }} />
        <Box sx={{ pb: 2 }} />
      </Stack>
    </Dialog>
  );
};
