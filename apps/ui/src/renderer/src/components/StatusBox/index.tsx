import { Body2, Box, BoxProps } from 'reactjs-shared-ui';
import { useMemo } from 'react';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { PROCESS_STATUS_COLORS } from '@constants/colors';
import { ProcessStatus } from '@constants/enums';

export interface StatusBoxProps extends BoxProps {
  status?: ProcessStatus;
}

export const StatusBox: React.FC<StatusBoxProps> = ({
  status = ProcessStatus.Pending,
  ...rest
}) => {
  const { t } = useI18n();
  const TEXTS: Record<ProcessStatus, string> = useMemo(
    () => ({
      cancelled: t('cancelled'),
      error: t('error'),
      inProgress: t('inProgress'),
      pending: t('pending'),
      success: t('success')
    }),
    [t]
  );

  return (
    <Box border={1} p={1} borderRadius={2} color="text.secondary" {...rest}>
      <Body2 fontWeight={500} color={PROCESS_STATUS_COLORS[status]}>
        {TEXTS[status]}
      </Body2>
    </Box>
  );
};
