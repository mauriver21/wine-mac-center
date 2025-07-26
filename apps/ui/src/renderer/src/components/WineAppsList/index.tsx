import React, { forwardRef, useEffect, useState } from 'react';
import {
  Body1,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  H6,
  SkeletonLoader,
  Stack
} from 'reactjs-ui-core';
import { useSelector } from 'react-redux';
import { VirtuosoGrid } from 'react-virtuoso';
import { useWineAppModel } from '@models/useWineAppModel';
import { RootState } from '@interfaces/RootState';
import { AppCard } from '@components/AppCard';
import { SearchField } from '@components/SearchField';
import { SortDirectionSelect } from '@components/SortDirectionSelect';
import { WineAppsListContext } from '@contexts/WineAppsListContext';
import { Button } from '@components/Button';

interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const List = forwardRef<HTMLDivElement, ListProps>(({ style, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    style={{
      display: 'grid',
      gridAutoColumns: 'minmax(200px, auto)',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gridGap: '10px',
      padding: '10px',
      ...style
    }}
  >
    {children}
  </div>
));

const Item: React.FC<ItemProps> = ({ style, children, ...rest }) => (
  <div
    {...rest}
    style={{
      padding: 12,
      display: 'flex',
      flex: 'none',
      alignContent: 'stretch',
      boxSizing: 'border-box',
      ...style
    }}
  >
    {children}
  </div>
);

export const WineAppsList: React.FC = () => {
  const wineAppModel = useWineAppModel();
  const [showDialog, setShowDialog] = useState(false);
  const [appName, setAppName] = useState('');
  const [filters, setFilters] = useState<Parameters<typeof wineAppModel.selectWineApps>[1]>({
    criteria: '',
    order: 'asc'
  });
  const { loaders } = wineAppModel;
  const wineApps = useSelector((state: RootState) => wineAppModel.selectWineApps(state, filters));

  useEffect(() => {
    wineAppModel.listAll();
  }, []);

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <WineAppsListContext.Provider value={{ showDialog, setShowDialog, appName, setAppName }}>
      <Box display="grid" gridTemplateRows="auto 1fr">
        <Stack direction="row" spacing={1} pt={2} px={3}>
          <Stack spacing={1} direction="row" width="100%" maxWidth={450}>
            <SearchField
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  criteria: event.currentTarget.value
                }))
              }
            />
            <SortDirectionSelect
              value={filters?.order}
              onChange={(order) =>
                setFilters((prev) => ({
                  ...prev,
                  order
                }))
              }
            />
          </Stack>
        </Stack>
        <SkeletonLoader loading={loaders.listingAll}>
          <VirtuosoGrid
            style={{ height: '100%' }}
            data={wineApps}
            components={{ List, Item }}
            itemContent={(_, wineApp) => (
              <AppCard key={wineApp.appConfigId} appConfigId={wineApp.appConfigId} />
            )}
          />
        </SkeletonLoader>
      </Box>
      <Dialog onClose={closeDialog} open={showDialog} fullWidth maxWidth="sm">
        <DialogContent>
          {appName ? (
            <H6 color="text.secondary" mb={2}>
              Install {appName}
            </H6>
          ) : (
            <></>
          )}
          <Body1>Select the type of installation:</Body1>
        </DialogContent>
        <DialogActions>
          <Button>Manual</Button>
          <Button>Automatic</Button>
        </DialogActions>
      </Dialog>
    </WineAppsListContext.Provider>
  );
};
