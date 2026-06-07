import React, { useMemo } from 'react';
import { CrownIcon } from '@assets/icons/24/outline/CrownIcon';
import { License } from '@constants/enums';
import { PlayCircleOutline } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { Body2, Icon } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LicenseChipProps extends Omit<ChipProps, 'label'> {
  license: License;
}

export const LicenseChip: React.FC<LicenseChipProps> = ({ license, sx, ...rest }) => {
  const { t } = useI18n();

  const style = useMemo(() => {
    return [
      {
        license: License.Free,
        chipProps: { color: 'success' },
        iconProps: { render: PlayCircleOutline, mr: 0.2, mt: '-2px', size: 16 }
      },
      {
        license: License.Paid,
        chipProps: { color: 'warning' },
        iconProps: { render: CrownIcon }
      }
    ].find((item) => item.license === license);
  }, [license]);

  return (
    <Chip
      sx={{ height: '20px', '& > .MuiChip-label': { paddingX: 1 }, ...sx }}
      label={
        <Body2 fontWeight="bold" display="flex" alignItems="center" fontSize={11}>
          <Icon mt={'-4px'} mr={0.2} color="secondary" render={() => <></>} {...style?.iconProps} />
          {t(license)}
        </Body2>
      }
      {...(style?.chipProps as LicenseChipProps)}
      {...rest}
    />
  );
};
