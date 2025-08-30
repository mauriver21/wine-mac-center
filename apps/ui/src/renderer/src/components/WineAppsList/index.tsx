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
} from 'reactjs-shared-ui';
import { useSelector } from 'react-redux';
import { VirtuosoGrid } from 'react-virtuoso';
import { RootState } from '@interfaces/RootState';
import { AppCard } from '@components/AppCard';
import { SearchField } from '@components/SearchField';
import { SortDirectionSelect } from '@components/SortDirectionSelect';
import { WineAppsListContext } from '@contexts/WineAppsListContext';
import { Button } from '@components/Button';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { ConfigOrigin, PipelineAction } from '@constants/enums';
import { useWineAppPipelineModel } from '@models/useWineAppPipelineModel';

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
  const wineAppConfigModel = useWineAppConfigModel();
  const wineAppPipelineModel = useWineAppPipelineModel();

  const [showDialog, setShowDialog] = useState(false);
  const [appName, setAppName] = useState<string>();
  const [filters, setFilters] = useState<
    Parameters<typeof wineAppConfigModel.selectWineAppsConfigs>[1]
  >({
    criteria: '',
    order: 'asc',
    origin: ConfigOrigin.CLOUD
  });
  const { loaders } = wineAppConfigModel;
  const wineAppsConfigs = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppsConfigs(state, filters)
  );
  const navigate = useNavigateApp();

  const closeDialog = () => {
    setShowDialog(false);
  };

  const runPipeline = async () => {
    const origin = ConfigOrigin.CLOUD;
    await wineAppPipelineModel.scaffoldWineApp({ appName, origin });
    navigate.navigateToAppPipeline(appName, {
      origin,
      action: PipelineAction.RUN
    });
  };

  useEffect(() => {
    wineAppConfigModel.listAll();
  }, []);

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
            data={wineAppsConfigs}
            components={{ List, Item }}
            itemContent={(index, wineAppConfig) => (
              <AppCard key={index} appName={wineAppConfig.name} origin={ConfigOrigin.CLOUD} />
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
          <Button onClick={runPipeline}>Automatic</Button>
        </DialogActions>
      </Dialog>
    </WineAppsListContext.Provider>
  );
};
