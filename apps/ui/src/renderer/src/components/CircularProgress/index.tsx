import {
  CircularProgress as BaseCircularProgress,
  CircularProgressProps as BaseCircularProgressProps,
  Box
} from 'reactjs-shared-ui';

export interface CircularProgressProps extends BaseCircularProgressProps {
  size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ size = 20, ...rest }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={size} height={size}>
      <BaseCircularProgress {...rest} style={{ width: size, height: size }} />
    </Box>
  );
};
