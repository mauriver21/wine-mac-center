import { SteamIcon } from '@assets/icons/24/outline/SteamIcon';
import { Button } from '@components/Button';
import { CardItem } from '@components/CardItem';
import { SteamCliDeveloper } from '@components/SteamCliDeveloper';
import { useLocalState } from '@hooks/useLocalState';
import { useSteamCli } from '@hooks/useSteamCli';
import { useAppModel } from '@models/useAppModel';
import { alpha, TextFieldProps } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  ContentsArea,
  ContentsAreaHandle,
  ContentsClass,
  H6,
  Stack,
  TableOfContents
} from 'reactjs-shared-ui';
import { TextField } from 'reactjs-shared-ui/forms';

const ITEM_STYLE = { px: '20px !important' };

export const Settings: React.FC = () => {
  const contentsAreaRef = useRef<ContentsAreaHandle>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const { getState, setState } = useLocalState('steamCredentials');
  const steamCli = useSteamCli();
  const appModel = useAppModel();

  const onChangeSteamCredentials: TextFieldProps['onChange'] = ({
    currentTarget: { name, value }
  }) => {
    setState({ ...getState(), [name]: value });
  };

  const steamLogin = async () => {
    setLoggingIn(true);
    const { userName = '', password = '' } = getState() || {};
    try {
      await steamCli.login({ userName, password });
      appModel.dispatchSuccessMessage('Login Success');
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    return () => {
      steamCli.refresh();
    };
  }, []);

  const modules = [
    <CardItem icon={SteamIcon} label="Steam Credentials">
      <Stack spacing={2}>
        <Stack spacing={2}>
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.userName}
            autoComplete="off"
            name="userName"
            label="User Name"
          />
          <TextField
            onChange={onChangeSteamCredentials}
            value={getState()?.password}
            autoComplete="off"
            name="password"
            type="password"
            label="Password"
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button disabled={loggingIn} onClick={steamLogin}>
            Login
          </Button>
        </Stack>
        <SteamCliDeveloper />
      </Stack>
    </CardItem>
  ];

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
