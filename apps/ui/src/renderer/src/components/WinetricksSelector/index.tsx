import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { SearchField } from '@components/SearchField';
import { RootState } from '@interfaces/RootState';
import { useWinetrickModel } from '@models/useWinetrickModel';
import { useSelector } from 'react-redux';
import { Accordion, Body2, Box, Grid, Icon, SkeletonLoader, Stack } from 'reactjs-shared-ui';
import { Checkbox, Field, FieldProps } from 'reactjs-shared-ui/forms';
import { Winetricks } from '@interfaces/Winetricks';
import { Chip, IconButton } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface WinetricksSelectorProps extends FieldProps {
  name?: string;
  disabled?: boolean;
  value?: string[];
  showSelectedVerbs?: boolean;
}

const CATEGORIES = [
  { key: 'apps', label: 'Apps' },
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
  name = '',
  control,
  fieldOptions,
  value,
  disabled,
  showSelectedVerbs
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
        <Field
          control={control}
          fieldOptions={fieldOptions}
          as="checkbox-group"
          name={name}
          value={value}
          render={(field) => {
            const verbs = field.props.value;
            return (
              <>
                {CATEGORIES.map((category, index) => {
                  const numItems = winetricks?.[category.key as keyof Winetricks]?.length || 0;
                  const itemHeight = 45;

                  return (
                    <React.Fragment key={index}>
                      {winetricks[category.key] ? (
                        <Box key={index}>
                          <Accordion
                            label={category.label}
                            expanded={expandedState[category.key]}
                            onClick={(state, event) => {
                              disabled && event.preventDefault();
                              setExpandedState({
                                ...DEFAULT_EXPANDED_STATE,
                                [category.key]: state.expanded
                              });
                            }}
                          >
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
                          </Accordion>
                        </Box>
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  );
                })}
                {showSelectedVerbs && verbs?.length ? (
                  <Stack spacing={1} pt={2}>
                    <Body2 fontWeight={500} color="text.secondary">
                      Selected verbs:
                    </Body2>
                    <Box>
                      {verbs?.map((item) => (
                        <Box
                          display="inline-block"
                          position="relative"
                          sx={{ '&:hover .remove-verb': { display: 'block' } }}
                        >
                          <Chip sx={{ marginBottom: 1, marginRight: 1 }} label={item} />
                          <IconButton
                            className="remove-verb"
                            sx={{ position: 'absolute', top: -15, right: -5, display: 'none' }}
                            onClick={() => {
                              field.props.onChange({ target: { checked: false, value: item } });
                            }}
                          >
                            <Icon render={XMarkIcon} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                ) : (
                  <></>
                )}
              </>
            );
          }}
        />
      </Stack>
    </SkeletonLoader>
  );
};
