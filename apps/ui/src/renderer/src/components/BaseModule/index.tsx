import { useAppConfigContext } from '@hooks/useAppConfigContext';
import {
  Box,
  ContentsClass,
  Card,
  CardContent,
  Stack,
  Icon,
  H6,
  Button,
  Body1,
  BoxProps
} from 'reactjs-ui-core';

export interface BaseModuleProps extends BoxProps {
  icon: React.FC;
  label: string;
  description: string;
  method: () => void;
}

const ITEM_STYLE = { px: '20px !important' };

export const BaseModule: React.FC<BaseModuleProps> = ({
  icon,
  label,
  description,
  method,
  ...rest
}) => {
  const { wineApp, loading } = useAppConfigContext() || {};

  return (
    <Box width="100%" pt={2} sx={ITEM_STYLE} {...rest}>
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
              title={`Run ${label}`}
              disabled={wineApp === undefined || loading}
              color="secondary"
              sx={{
                width: 90,
                height: 60,
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }}
              onClick={() => method?.()}
            >
              <Body1>Run</Body1>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
