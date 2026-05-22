import { useTheme } from '@mui/material';
import { Code as BaseCode, CodeProps as BaseCodeProps } from 'reactjs-shared-ui/syntax-highlighter';

export type CodeProps = BaseCodeProps;

export const Code: React.FC<CodeProps> = (props) => {
  const theme = useTheme();

  return (
    <BaseCode
      sx={{
        border: `1px solid ${theme.palette.secondary.dark}`,
        '& > pre': {
          minHeight: 40,
          maxHeight: 200,
          overflowY: 'auto',
          overflowX: 'hidden !important'
        }
      }}
      language="bash"
      {...props}
    />
  );
};
