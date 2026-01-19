import React, { useRef } from 'react';
import { ButtonProps } from '@components/Button';
import {
  Box,
  H6,
  Button,
  ContentsAreaHandle,
  ContentsArea,
  TableOfContents,
  Stack
} from 'reactjs-shared-ui';
import { alpha } from '@mui/material';

export interface ConfigLayoutProps {
  mainTitle: string | undefined;
  contentSlot: React.ReactNode;
  backButtonProps?: ButtonProps;
  actionsSlot?: React.ReactNode;
  showTableOfContents?: boolean;
}

export const ConfigLayout: React.FC<ConfigLayoutProps> = ({
  mainTitle,
  backButtonProps,
  contentSlot,
  actionsSlot,
  showTableOfContents = true
}) => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);

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
            {mainTitle}
          </H6>
          {backButtonProps ? (
            <Button
              sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
              color="secondary"
              {...backButtonProps}
            >
              Back
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={showTableOfContents ? '1fr 250px' : '1fr'}
          overflow="auto"
        >
          <Box
            overflow="auto"
            display="grid"
            gridTemplateRows="1fr auto"
            sx={{
              '& ::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => alpha(theme.palette?.primary.dark, 0.3)
              }
            }}
          >
            <Box display="grid" overflow="auto">
              {contentSlot}
            </Box>
            {actionsSlot ? (
              <Stack
                borderTop={(theme) => `1px solid ${theme.palette.secondary.light}`}
                p={2}
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                {actionsSlot}
              </Stack>
            ) : (
              <></>
            )}
          </Box>
          {showTableOfContents && (
            <Box borderLeft={(theme) => `1px solid ${theme.palette.secondary.light}`}>
              <TableOfContents pt={1} />
            </Box>
          )}
        </Box>
      </ContentsArea>
    </Box>
  );
};
