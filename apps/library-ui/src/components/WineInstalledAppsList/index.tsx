import React, { forwardRef, useEffect, useState } from 'react';
import {
  AppConfigDialog,
  InstalledAppCard,
  SearchField,
  SortDirectionSelect,
} from '@components';
import { useWineInstalledAppModel } from '@models';
import { Button, Icon, SkeletonLoader, Stack } from 'reactjs-ui-core';
import { useSelector } from 'react-redux';
import { VirtuosoGrid } from 'react-virtuoso';
import { RootState } from '@interfaces';
import { PlusIcon } from '@heroicons/react/24/solid';

interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const List = forwardRef<HTMLDivElement, ListProps>(
  ({ style, children, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      style={{
        display: 'grid',
        gridAutoColumns: 'minmax(200px, auto)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: '10px',
        padding: '10px',
        ...style,
      }}
    >
      {children}
    </div>
  ),
);

const Item: React.FC<ItemProps> = ({ style, children, ...rest }) => (
  <div
    {...rest}
    style={{
      padding: 12,
      display: 'flex',
      flex: 'none',
      alignContent: 'stretch',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

export const WineInstalledAppsList: React.FC = () => {
  const wineInstalledAppModel = useWineInstalledAppModel();
  const [showDialog, setShowDialog] = useState(false);
  const [filters, setFilters] = useState<
    Parameters<typeof wineInstalledAppModel.selectWineInstalledApps>[1]
  >({ criteria: '', order: 'asc' });
  const { loaders } = wineInstalledAppModel;
  const wineInstalledApps = useSelector((state: RootState) =>
    wineInstalledAppModel.selectWineInstalledApps(state, filters),
  );

  useEffect(() => {
    wineInstalledAppModel.listAll();
  }, []);

  return (
    <Stack display="grid" gridTemplateRows="auto 1fr" spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        pt={2}
        px={3}
        justifyContent="space-between"
      >
        <Stack spacing={1} direction="row" width="100%" maxWidth={450}>
          <SearchField
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                criteria: event.currentTarget.value,
              }))
            }
          />
          <SortDirectionSelect
            value={filters?.order}
            onChange={(order) =>
              setFilters((prev) => ({
                ...prev,
                order,
              }))
            }
          />
        </Stack>
        <Stack>
          <Button
            rootStyle={{ flexGrow: 1 }}
            sx={{
              paddingLeft: '7px',
              height: '100%',
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
            }}
            color="secondary"
            onClick={() => setShowDialog(true)}
          >
            <Icon
              pr={1}
              strokeWidth={3}
              color="primary.main"
              render={PlusIcon}
            />
            Create App
          </Button>
        </Stack>
      </Stack>
      <SkeletonLoader loading={loaders.listingAll}>
        <VirtuosoGrid
          style={{ height: '100%' }}
          data={wineInstalledApps}
          components={{ List, Item }}
          itemContent={(_, installedWineApp) => (
            <InstalledAppCard
              key={installedWineApp.id}
              appId={installedWineApp.id}
            />
          )}
        />
      </SkeletonLoader>
      {showDialog ? (
        <AppConfigDialog
          setOpen={setShowDialog}
          open={showDialog}
          onClose={() => {
            console.log('XXXX');
            setShowDialog(false);
          }}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
};
