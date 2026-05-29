import { Body1, Box, H4, Image, Stack } from 'reactjs-shared-ui';
import ScriptWindow from '@assets/imgs/app-config-window.png';

export const WineConfigSection: React.FC = () => (
  <Stack spacing={3}>
    <Box display="grid" gridTemplateColumns="1.5fr 2fr">
      <Stack p={2} spacing={2}>
        <H4>
          <H4 component="span" color="info" fontWeight="bold">
            Aplica configuraciones de Wine
          </H4>{' '}
          fácilmente en cada una de tus apps.
        </H4>
        <Body1>
          Personaliza parámetros específicos, ajusta versiones de Windows,
          administra librerías, variables de entorno y opciones avanzadas sin
          complicaciones, manteniendo cada app optimizada y aislada según sus
          necesidades.
        </Body1>
      </Stack>
      <Box>
        <Image style={{ marginTop: -17 }} width="100%" src={ScriptWindow} />
      </Box>
    </Box>
  </Stack>
);
