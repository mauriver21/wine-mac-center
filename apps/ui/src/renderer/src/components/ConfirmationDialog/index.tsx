import { Button } from '@components/Button';
import React from 'react';
import { DialogProps, Dialog, Stack, Body1 } from 'reactjs-shared-ui';

export interface ConfirmationDialogProps extends DialogProps {
  loading?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept: () => Promise<void>;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  setOpen,
  disableEscapeKeyDown,
  disableBackdropClick,
  loading,
  onAccept: onAcceptProp,
  ...rest
}) => {
  const close = () => setOpen(false);

  const onAccept = async () => {
    await onAcceptProp?.();
    close();
  };

  return (
    <Dialog
      disableEscapeKeyDown={disableEscapeKeyDown || loading}
      disableBackdropClick={disableEscapeKeyDown || loading}
      fullWidth
      onClose={close}
      {...rest}
    >
      <Stack direction="column" justifyContent="space-between" bgcolor="secondary.main" p={2}>
        <Body1 fontWeight={500} py={3}>
          Do you want to confirm this operation?
        </Body1>
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button disabled={loading} onClick={onAccept}>
            Accept
          </Button>
          <Button disabled={loading} onClick={close}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
