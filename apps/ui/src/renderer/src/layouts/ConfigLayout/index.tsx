import React, { useEffect, useRef, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { ConfigLayoutContext } from '@contexts/ConfigLayoutContext';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { useRefresh } from '@utils/useRefresh';
import './index.css';

export interface ConfigLayoutProps {
  mainTitle: string | undefined;
  contentSlot: React.ReactNode;
  actionsSlot?: React.ReactNode;
  showTableOfContents?: boolean;
  showBack?: boolean;
  signal?: number;
  backCallback?: Function;
}

export const ConfigLayout: React.FC<ConfigLayoutProps> = ({
  mainTitle,
  contentSlot,
  actionsSlot,
  showTableOfContents = true,
  showBack = true,
  signal: signalProp,
  backCallback
}) => {
  const { t } = useI18n();
  const { refresh, signal } = useRefresh();
  const navigate = useNavigate();
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    contentsAreaRef.current?.refreshTableOfContents();
  }, [signalProp, signal]);

  return (
    <ConfigLayoutContext.Provider value={{ setLoading, refresh }}>
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
            {mainTitle ? (
              <H6 color="text.secondary" fontWeight={500}>
                {t(mainTitle)}
              </H6>
            ) : (
              <></>
            )}
            {showBack ? (
              <Button
                disabled={loading}
                sx={{ border: (theme) => `1px solid ${theme.palette.primary.dark}` }}
                color="secondary"
                onClick={() => {
                  backCallback ? backCallback?.() : navigate(-1);
                }}
              >
                {t('back')}
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
    </ConfigLayoutContext.Provider>
  );
};
