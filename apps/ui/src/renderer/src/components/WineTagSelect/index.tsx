import { useWineModel } from '@models/useWineModel';
import { Autocomplete, AutocompleteProps, CircularProgress, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useI18n } from 'reactjs-shared-ui/i18next';

const OPTION_HEIGHT = 40;
const VISIBLE_OPTIONS = 7;
const LIST_VERTICAL_PADDING = 16;

export interface WineTagSelectProps
  extends Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'> {
  label?: string;
}

export const WineTagSelect: React.FC<WineTagSelectProps> = ({ label, disabled, ...props }) => {
  const { t } = useI18n();
  const wineModel = useWineModel();
  const repositoryDownloaded = useSelector(wineModel.selectRepositoryDownloaded);
  const wineTags = useSelector(wineModel.selectWineTags);
  const { checkingOutTag, listingTags } = useSelector(wineModel.selectWineLoaders);
  const loading = listingTags || checkingOutTag;

  useEffect(() => {
    if (repositoryDownloaded) wineModel.getWineTags();
  }, [repositoryDownloaded]);

  return (
    <Autocomplete
      {...props}
      autoHighlight
      disabled={loading || disabled}
      ListboxProps={{
        sx: {
          maxHeight: OPTION_HEIGHT * VISIBLE_OPTIONS + LIST_VERTICAL_PADDING,
          '& .MuiAutocomplete-option': {
            height: OPTION_HEIGHT,
            minHeight: OPTION_HEIGHT
          }
        }
      }}
      loading={loading}
      options={wineTags}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || t('wineVersion')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          modifiers: [{ name: 'flip', enabled: false }]
        }
      }}
    />
  );
};
