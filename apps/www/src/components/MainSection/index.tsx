import type React from 'react';
import WindowImage from '@assets/imgs/window-image.png';
import { Body1, Box, H4, H5, Icon, Image, Stack } from 'reactjs-shared-ui';
import { Button } from '@components/Button';
import { FolderArrowDownIcon } from '@heroicons/react/16/solid';

export const MainSection: React.FC = () => {
  return (
    <Box display="grid" gridTemplateColumns="1.5fr 2fr">
      <Stack p={2} spacing={2}>
        <H4>
          Organiza y lanza tus aplicaciones de Windows en Mac{' '}
          <H4 component="span" color="info" fontWeight="bold">
            desde un solo lugar.
          </H4>
        </H4>
        <Body1>
          Wine Mac Center es una interfaz gráfica moderna que te permite
          gestionar aplicaciones de Windows utilizando Wine, de forma sencilla y
          sin complicaciones.
        </Body1>
        <Button
          sx={{ marginTop: 3 }}
          onClick={() =>
            window.open(
              'https://github.com/mauriver21/wine-mac-center/releases',
              '_blank',
            )
          }
        >
          <Icon size={24} pr={1} render={FolderArrowDownIcon} />
          <H5>Descargar</H5>
        </Button>
      </Stack>
      <Stack>
        <Image width="100%" src={WindowImage} />
      </Stack>
    </Box>
  );
};
