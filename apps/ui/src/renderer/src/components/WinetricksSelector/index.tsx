import { Virtuoso } from 'react-virtuoso';
import { SearchField } from '@components/SearchField';
import { RootState } from '@interfaces/RootState';
import { useWinetrickModel } from '@models/useWinetrickModel';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Accordion, Box, Grid, SkeletonLoader, Stack } from 'reactjs-ui-core';
import { Checkbox, Field, FieldProps } from 'reactjs-ui-form-fields';
import { Winetricks } from '@interfaces/Winetricks';

export interface WinetricksSelectorProps extends FieldProps {
  name?: string;
  disabled?: boolean;
}

const CATEGORIES = [
  { key: 'apps', label: 'Apps' },
  { key: 'benchmarks', label: 'Benchmarks' },
  { key: 'dlls', label: 'Dlls' },
  { key: 'fonts', label: 'Fonts' },
  { key: 'settings', label: 'Settings' }
];

const DEFAULT_EXPANDED_STATE = {
  apps: false,
  benchmarks: false,
  dlls: false,
  fonts: false,
  settings: false
};

export const WinetricksSelector: React.FC<WinetricksSelectorProps> = ({
  name,
  control,
  fieldOptions,
  value,
  disabled
}) => {
  const winetrickModel = useWinetrickModel();
  const [filters, setFilters] = useState({ verb: '' });
  const [expandedState, setExpandedState] = useState(DEFAULT_EXPANDED_STATE);
  const { loaders } = useSelector(winetrickModel.selectWinetrickState);
  const winetricks = useSelector((state: RootState) =>
    winetrickModel.selectWinetricks(state, filters)
  );

  useEffect(() => {
    winetrickModel.listAll();
  }, []);

  return (
    <SkeletonLoader loading={loaders.listingAll}>
      <Stack spacing={1}>
        <SearchField
          disabled={disabled}
          onChange={(event) => {
            setFilters({ verb: event.target.value });
          }}
        />
        {CATEGORIES.map((category, index) => (
          <>
            {winetricks[category.key] ? (
              <Box key={index}>
                <Accordion
                  label={category.label}
                  expanded={expandedState[category.key]}
                  onClick={(state, event) => {
                    disabled && event.preventDefault();
                    setExpandedState({ ...DEFAULT_EXPANDED_STATE, [category.key]: state.expanded });
                  }}
                >
                  <Field
                    control={control}
                    fieldOptions={fieldOptions}
                    as="checkbox-group"
                    name={name}
                    value={value}
                    render={(field) => {
                      const numItems = winetricks?.[category.key as keyof Winetricks]?.length || 0;
                      const itemHeight = 45;

                      return (
                        <Grid container spacing={0}>
                          <Virtuoso
                            style={{
                              height: numItems > 5 ? 200 : numItems * itemHeight,
                              width: '100%'
                            }}
                            data={winetricks?.[category.key]}
                            itemContent={(index, winetrick) => (
                              <Grid height={itemHeight} key={index} item xs={12}>
                                <Checkbox
                                  name={name}
                                  label={winetrick.verb}
                                  value={winetrick.verb}
                                  checked={field.helpers.isChecked(winetrick.verb)}
                                  onChange={(event) => {
                                    field.props.onChange(event);
                                  }}
                                  onBlur={field.props.onBlur}
                                  disabled={disabled}
                                />
                              </Grid>
                            )}
                          />
                        </Grid>
                      );
                    }}
                  />
                </Accordion>
              </Box>
            ) : (
              <></>
            )}
          </>
        ))}
      </Stack>
    </SkeletonLoader>
  );
};
