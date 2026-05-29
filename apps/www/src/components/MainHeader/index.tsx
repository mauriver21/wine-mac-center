import { Box, H6, Link, Stack } from 'reactjs-shared-ui';

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
        <Link to="#item-1">Item 1</Link>
        <Link to="#item-2">Item 2</Link>
        <Link to="#item-3">Item 3</Link>
        <Link to="#item-4">Item 4</Link>
      </Stack>
      <Box />
    </Stack>
  );
};
