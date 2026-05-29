import type React from 'react';
import WindowImage from '@assets/imgs/window-image.png';
import { Body1, Box, H4, Image, Stack } from 'reactjs-shared-ui';

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
      </Stack>
      <Stack>
        <Image width="100%" src={WindowImage} />
      </Stack>
    </Box>
  );
};
