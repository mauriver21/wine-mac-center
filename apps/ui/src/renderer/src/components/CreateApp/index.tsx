import React, { useRef } from 'react';
import {
  Box,
  Button,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-ui-core';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material';

export const CreateApp: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const navigate = useNavigate();

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
              Create App
            </H6>
            <Button color="secondary" onClick={() => navigate('/apps')}>
              Back
            </Button>
          </Box>
          <Box
            sx={{
              height: '1px',
              boxShadow: (theme) => `inset 0 1px ${theme.palette.primary.main}`
            }}
          ></Box>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 250px" overflow="auto">
          <Box
            overflow="auto"
            display="grid"
            sx={{
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => alpha(theme.palette?.secondary.dark, 0.3)
              }
            }}
          >
            <Stack
              className={ContentsClass.ScrollableArea}
              overflow="auto"
              spacing={1}
              sx={{
                overflowX: 'hidden !important'
              }}
              pb={2}
              alignItems="center"
            ></Stack>
          </Box>
          <Box borderLeft={(theme) => `1px solid ${theme.palette.primary.main}`}>
            <TableOfContents pt={1} />
          </Box>
        </Box>
      </ContentsArea>
    </Box>
  );
};
