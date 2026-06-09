import { Button } from '@components/Button';
import { DRIVE_C_PATH } from '@constants/paths';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Executable } from '@interfaces/Executable';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { Checkbox, Chip, TextField } from '@mui/material';
import { Box, FormControlLabel, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface ScriptExecutableSelectorItemProps {
  index?: number;
  hideRemoveAction?: boolean;
  removeAction?: (index: number) => void;
  executable?: WineAppExecutable;
  onChange?: (
    executable: Partial<Executable> & {
      index: number;
    }
  ) => void;
}

export const ScriptExecutableSelectorItem: React.FC<ScriptExecutableSelectorItemProps> = ({
  index = 0,
  hideRemoveAction = false,
  removeAction,
  executable,
  onChange: onChangeProp
}) => {
  const { t } = useI18n();

  const onChange = (data: Partial<Executable>) => {
    onChangeProp?.({ ...data, index });
  };

  return (
    <Box
      position="relative"
      bgcolor="secondary.dark"
      borderRadius={2}
      pt={5}
      sx={{ '&:hover .exe-actions': { display: 'flex' } }}
    >
      <Box position="absolute" top={-7} left={0}>
        <Chip
          sx={{ opacity: 1, bgcolor: 'secondary.light' }}
          label={t('executable', { number: index + 1 })}
        />
      </Box>
      <Box className="exe-actions" sx={{ display: 'none' }} position="absolute" top={-7} left={-15}>
        {!hideRemoveAction && (
          <Button
            variant="contained"
            sx={{ borderRadius: 10 }}
            equalSize={32}
            onClick={() => {
              removeAction?.(index);
            }}
            title={t('removeExecutable')}
          >
            <Icon strokeWidth={3} render={TrashIcon} />
          </Button>
        )}
      </Box>
      <Stack spacing={2}>
        <TextField
          InputProps={{
            startAdornment: <Chip label={DRIVE_C_PATH} sx={{ mr: 1 }} />
          }}
          label={t('executablePath')}
          placeholder={t('relativePathExample')}
          onBlur={(event) => {
            onChange?.({ path: event.target.value });
          }}
        />
        <TextField
          label={t('exeFlags')}
          value={executable?.flags}
          onChange={(event) => {
            onChange?.({ flags: event.target.value });
          }}
        />
        <FormControlLabel
          sx={{ mt: '7px !important' }}
          control={
            <Checkbox
              sx={{ ml: '-12px' }}
              color="success"
              checked={executable?.main}
              disableRipple
              onChange={(event) => {
                if (executable?.main) return;
                onChange?.({ main: event.target.checked });
              }}
            />
          }
          label={t('setAsMainExecutable')}
        />
      </Stack>
    </Box>
  );
};
