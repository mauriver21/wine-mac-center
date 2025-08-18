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
import { ScriptItem } from '@components/ScriptItem';

interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const List = forwardRef<HTMLDivElement, ListProps>(({ style, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    style={{
      display: 'grid',
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
      padding: 12,
      boxSizing: 'border-box',
      ...style
    }}
  >
    {children}
  </div>
);

export const Scripts: React.FC = () => {
  const { navigateToCreateScript } = useNavigateApp();
  const appConfigModel = useWineAppConfigModel();
  const { loaders } = appConfigModel;
  const [filters, setFilters] = useState({ criteria: '', order: 'asc' as SortDirection });
  const appConfigs = useSelector((state: RootState) =>
    appConfigModel.selectWineAppConfigs(state, filters)
  );

  useEffect(() => {
    appConfigModel.listAll();
  }, []);

  return (
    <Box display="grid" gridTemplateRows="auto 1fr">
      <Stack direction="row" spacing={1} pt={2} px={3} justifyContent="space-between">
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

        <Stack>
          <Button
            rootStyle={{ flexGrow: 1 }}
            sx={{
              paddingLeft: '7px',
              height: '100%',
              border: (theme) => `1px solid ${theme.palette.primary.main}`
            }}
            color="secondary"
            onClick={navigateToCreateScript}
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
          itemContent={(index, appConfig) => <ScriptItem key={index} appName={appConfig.name} />}
        />
      </SkeletonLoader>
    </Box>
  );
};
