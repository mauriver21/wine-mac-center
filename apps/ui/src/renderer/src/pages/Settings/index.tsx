import { EnvPaths } from '@components/EnvPaths';
import { SteamCredentials } from '@components/SteamCredentials';
import { alpha } from '@mui/material';
import { useRef } from 'react';
import {
  Box,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';

const ITEM_STYLE = { px: '20px !important' };

export const Settings: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);

  const modules = [<EnvPaths />, <SteamCredentials />];

  return (
    <Box display="grid" overflow="auto">
      <ContentsArea
        ref={contentsAreaRef}
        style={{
          height: '100%',
          display: 'grid',
          overflow: 'auto',
          gridTemplateRows: 'auto 1fr'
        }}
      >
        <Box>
          <Box
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              boxShadow: (theme) => `inset 0 -1px ${theme.palette.secondary.main}`
            }}
          >
            <H6 color="text.secondary" fontWeight={500}>
              Settings
            </H6>
          </Box>
          <Box
            sx={{
              height: '1px',
              boxShadow: (theme) => `inset 0 1px ${theme.palette.secondary.light}`
            }}
          ></Box>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 250px" overflow="auto">
          <Box
            overflow="auto"
            display="grid"
            gridTemplateRows="1fr auto"
            sx={{
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
              }
            }}
          >
            <Stack
              overflow="auto"
              spacing={1}
              sx={{
                overflowX: 'hidden !important'
              }}
              pb={2}
              alignItems="center"
            >
              {modules.map((item, index) => (
                <Box
                  key={index}
                  width="100%"
                  maxWidth={800}
                  pt={2}
                  sx={ITEM_STYLE}
                  className={ContentsClass.Item}
                >
                  {item}
                </Box>
              ))}
            </Stack>
          </Box>
          <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
            <TableOfContents pt={1} />
          </Box>
        </Box>
      </ContentsArea>
    </Box>
  );
};
