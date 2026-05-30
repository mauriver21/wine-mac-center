import { Body1, Box, H4, H5, Image, Stack } from 'reactjs-shared-ui';
import AppCards from '@assets/imgs/apps-cards.png';
import ScriptWindow from '@assets/imgs/script-window.png';

export const ScriptsSection: React.FC = () => (
  <Stack spacing={3} id="scripts">
    <Stack p={2} spacing={2}>
      <H5 textAlign="center" fontWeight="bold">
        Biblioteca Online de Scripts.
      </H5>
      <Body1 textAlign="center">
        Descarga de scripts abiertos a la comunidad para instalar aplicaciones.
      </Body1>
      <Box>
        <Image src={AppCards} />
      </Box>
    </Stack>
    <Box display="grid" gridTemplateColumns="2fr 1.5fr">
      <Box>
        <Image style={{ marginTop: -17 }} width="100%" src={ScriptWindow} />
      </Box>
      <Stack p={2} spacing={2}>
        <H4>
          <H4 component="span" color="info" fontWeight="bold">
            Crea tus propios scripts
          </H4>{' '}
          para automatizar la instalación de aplicaciones.
        </H4>
        <Body1>
          Gestiona fácilmente Wine Engines, ejecuta comandos de Winetricks,
          descarga archivos necesarios y realiza procesos completos de
          instalación de manera automática, reproducible y mucho más cómoda.
          Ideal para simplificar configuraciones complejas y compartir entornos
          listos para usar.
        </Body1>
      </Stack>
    </Box>
  </Stack>
);
