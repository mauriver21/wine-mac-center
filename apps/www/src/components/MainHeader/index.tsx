import { scrollIntoView } from '@utils/scrollIntoView';
import { useEffect, useState } from 'react';
import { Box, H6, Image, Link, Stack } from 'reactjs-shared-ui';
import Logo from '@assets/imgs/logo.png';

export const MainHeader: React.FC = () => {
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const root = document.querySelector('#root');

    const onScroll = () => {
      setShowShadow(Boolean(root?.scrollTop));
    };

    root?.addEventListener('scroll', onScroll);

    return () => {
      root?.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Stack
      zIndex={100}
      p={2}
      top={0}
      bgcolor={'secondary.main'}
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      position="sticky"
      boxShadow={showShadow ? '0px 3px 12px -2px #171717ff' : ''}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Image src={Logo} width={28} />
        <H6>Wine Mac Center</H6>
      </Stack>
      <Stack spacing={3} alignItems="center" direction="row">
        <Link onClick={() => scrollIntoView('download')} to="/#download">
          Download
        </Link>
        <Link onClick={() => scrollIntoView('scripts')} to="/#scripts">
          Scripts
        </Link>
        <Link onClick={() => scrollIntoView('wine-config')} to="/#wine-config">
          Wine Config
        </Link>
      </Stack>
      <Box />
    </Stack>
  );
};
