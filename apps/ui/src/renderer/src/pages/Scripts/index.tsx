import { forwardRef, useEffect, useState } from 'react';
import { SearchField } from '@components/SearchField';
import { SortDirectionSelect } from '@components/SortDirectionSelect';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Box, Button, Icon, SkeletonLoader, Stack } from 'reactjs-shared-ui';
import { useNavigateApp } from '@hooks/useNavigateApp';
import { useWineAppConfigModel } from '@models/useWineAppConfigModel';
import { useSelector } from 'react-redux';
import { RootState } from '@interfaces/RootState';
import { SortDirection } from '@interfaces/SortDirection';
import { VirtuosoGrid } from 'react-virtuoso';
import { ConfigOrigin } from '@constants/enums';
import { AppCard } from '@components/AppCard';
import { ConfigOriginSelect } from '@components/ConfigOriginSelect';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { useAppModel } from '@models/useAppModel';
import { ScriptsContext } from '@contexts/ScriptsContext';

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
      width: '100%',
      paddingRight: 12,
      paddingLeft: 12,

      boxSizing: 'border-box',
      ...style
    }}
  >
    {children}
  </div>
);

export const Scripts: React.FC = () => {
  const [openConfirmRemoveScript, setOpenConfirmRemoveScript] = useState(false);
  const [appName, setAppName] = useState<string>();
  const [removingScript, setRemovingScript] = useState(false);
  const { navigateToScript } = useNavigateApp();
  const wineAppConfigModel = useWineAppConfigModel();
  const appModel = useAppModel();
  const { loaders } = wineAppConfigModel;
  const [filters, setFilters] = useState({
    criteria: '',
    order: 'asc' as SortDirection,
    origin: ConfigOrigin.SCRIPTS
  });
  const appConfigs = useSelector((state: RootState) =>
    wineAppConfigModel.selectWineAppsConfigs(state, filters)
  );

  const removeScript = async () => {
    if (appName === undefined || appName === '') {
      appModel.dispatchError(`Application name is not defined`);
    } else {
      setRemovingScript(true);
      await wineAppConfigModel.remove(appName);
      setRemovingScript(false);
    }
  };

  return (
    <ScriptsContext.Provider value={{ setAppName, setOpenConfirmRemoveScript }}>
      <Box display="grid" gridTemplateRows="auto 1fr">
        <ConfirmationDialog
          loading={removingScript}
          setOpen={setOpenConfirmRemoveScript}
          open={openConfirmRemoveScript}
          onAccept={removeScript}
        />
        <Stack direction="row" spacing={1} pt={2} px={3} justifyContent="space-between" pb={2}>
          <Stack spacing={1} direction="row" width="100%" maxWidth={450}>
            <SearchField
              sx={{ minWidth: 300 }}
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
            <ConfigOriginSelect
              sx={{ minWidth: 200 }}
              value={filters?.origin}
              onChange={(origin) =>
                setFilters((prev) => ({
                  ...prev,
                  origin
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
                border: (theme) => `1px solid ${theme.palette.primary.main}`
              }}
              color="secondary"
              onClick={() => navigateToScript()}
            >
              <Icon pr={1} strokeWidth={3} color="primary.main" render={PlusIcon} />
              Create Script
            </Button>
          </Stack>
        </Stack>
        <SkeletonLoader loading={loaders.listingAll}>
          <VirtuosoGrid
            style={{ height: '100%' }}
            data={appConfigs}
            components={{ List, Item }}
            itemContent={(index, appConfig) => (
              <AppCard key={index} appName={appConfig.name} origin={appConfig.origin} />
            )}
          />
        </SkeletonLoader>
      </Box>
    </ScriptsContext.Provider>
  );
};
