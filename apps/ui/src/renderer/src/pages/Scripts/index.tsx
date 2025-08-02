import { useState } from 'react';
import { SearchField } from '@components/SearchField';
import { SortDirectionSelect } from '@components/SortDirectionSelect';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Box, Button, Icon, Stack } from 'reactjs-ui-core';
import { useNavigateApp } from '@hooks/useNavigateApp';

export const Scripts: React.FC = () => {
  const { navigateToCreateScript } = useNavigateApp();
  const [filters, setFilters] = useState({ criteria: '', order: 'asc' });

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
    </Box>
  );
};
