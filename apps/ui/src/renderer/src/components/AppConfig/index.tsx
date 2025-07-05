import { RegeditIcon } from '@assets/icons';
import {
  Cog6ToothIcon,
  CommandLineIcon,
  CpuChipIcon,
  RectangleStackIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import {
  Body1,
  Box,
  Button,
  Card,
  CardContent,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Icon,
  Stack,
  TableOfContents
} from 'reactjs-ui-core';
import { ChangeWineEngineDialog } from '../ChangeWineEngineDialog';
import { WineApp } from '@interfaces/WineApp';
import { useNavigate, useParams } from 'react-router-dom';
import { createWineApp } from '@utils/createWineApp';
import { alpha } from '@mui/material';

export const AppConfig: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const [loading, setLoading] = useState(false);
  const [showChangeWineEngineDialog, setShowChangeWineEngineDialog] = useState(false);
  const [wineApp, setWineApp] = useState<WineApp>();
  const { realAppName } = useParams();
  const navigate = useNavigate();
  const options = [
    {
      label: 'Wine Config',
      icon: Cog6ToothIcon,
      description: (
        <Body1>
          Opens Wine&apos;s configuration tool to set Windows version, drives, libraries, and audio
          settings.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.winecfg({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Registry Editor',
      icon: RegeditIcon,
      description: (
        <Body1>
          Launches Wine&apos;s Registry Editor to view and modify the Windows-like registry.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.regedit({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Task Manager',
      icon: RectangleStackIcon,
      description: (
        <Body1>Opens Wine&apos;s Task Manager to monitor and manage running Wine processes.</Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.taskmgr({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Command Line',
      icon: CommandLineIcon,
      description: (
        <Body1>
          Starts a Windows-like command prompt for running commands and scripts in Wine.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.cmd({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Control Panel',
      icon: WrenchScrewdriverIcon,
      description: (
        <Body1>
          Opens Wine&apos;s Control Panel to adjust settings like fonts and installed programs.
        </Body1>
      ),
      method: () => {
        setLoading(true);
        wineApp?.control({
          onExit: () => {
            setLoading(false);
          }
        });
      }
    },
    {
      label: 'Change Engine',
      icon: CpuChipIcon,
      content: <Box>Content Works!</Box>
    }
  ];

  const ITEM_STYLE = { px: '20px !important' };

  useEffect(() => {
    (async () => {
      realAppName && setWineApp(await createWineApp(realAppName));
    })();
  }, [realAppName]);

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
              {realAppName}
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
            >
              {options.map((item, index) => (
                <Box
                  width="100%"
                  maxWidth={800}
                  key={index}
                  pt={2}
                  sx={ITEM_STYLE}
                  className={ContentsClass.Item}
                >
                  <Card>
                    <CardContent>
                      {item.content ? (
                        item.content
                      ) : (
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          <Stack direction="row" spacing={1}>
                            <Stack direction="row" minWidth={210} pb={1}>
                              <Icon strokeWidth={0} size={34} render={item.icon} pr={1} />
                              <H6 className={ContentsClass.ItemTitle}>{item.label}</H6>
                            </Stack>
                            <Box pr={2}>{item.description}</Box>
                          </Stack>
                          <Button
                            title={`Run ${item.label}`}
                            disabled={wineApp === undefined || loading}
                            color="secondary"
                            sx={{
                              width: 90,
                              height: 60,
                              border: (theme) => `1px solid ${theme.palette.primary.main}`
                            }}
                            onClick={() => item.method?.()}
                          >
                            <Body1>Run</Body1>
                          </Button>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
              <ChangeWineEngineDialog
                wineApp={wineApp}
                open={showChangeWineEngineDialog}
                setOpen={setShowChangeWineEngineDialog}
                onClose={() => {
                  setShowChangeWineEngineDialog(false);
                }}
              />
            </Stack>
          </Box>
          <Box borderLeft={(theme) => `1px solid ${theme.palette.primary.main}`}>
            <TableOfContents pt={1} />
          </Box>
        </Box>
      </ContentsArea>
    </Box>
  );
};
