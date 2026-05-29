import { Button } from '@components/Button';
import { H6, Link, Stack } from 'reactjs-shared-ui';

export const MainHeader: React.FC = () => {
  return (
    <Stack
      p={2}
      justifyContent="space-between"
      alignItems="center"
      direction="row"
    >
      <H6>Wine Mac Center</H6>
      <Stack spacing={3} alignItems="center" direction="row">
        <Link to="#a">Item 1</Link>
        <Link to="#a">Item 2</Link>
        <Link to="#a">Item 3</Link>
        <Link to="#a">Item 4</Link>
      </Stack>
      <Button>AAA</Button>
    </Stack>
  );
};
