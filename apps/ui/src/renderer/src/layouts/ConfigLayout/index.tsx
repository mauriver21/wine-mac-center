import React, { useRef } from 'react';
import { ButtonProps } from '@components/Button';
import { Box, H6, Button, ContentsAreaHandle, ContentsArea } from 'reactjs-shared-ui';

export interface ConfigLayoutProps {
  mainTitle: string;
  backButtonProps?: ButtonProps;
  contentSlot?: React.ReactNode;
}

export const ConfigLayout: React.FC<ConfigLayoutProps> = ({
  mainTitle,
  backButtonProps,
  contentSlot
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
          <Button
            sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
            color="secondary"
            {...backButtonProps}
          >
            Back
          </Button>
        </Box>
        <Box display="grid" overflow="auto">
          {contentSlot}
        </Box>
      </ContentsArea>
    </Box>
  );
};
