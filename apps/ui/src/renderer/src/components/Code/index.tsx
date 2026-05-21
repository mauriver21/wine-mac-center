import { Code as BaseCode, CodeProps as BaseCodeProps } from 'reactjs-shared-ui/syntax-highlighter';

export type CodeProps = BaseCodeProps;

export const Code: React.FC<CodeProps> = (props) => (
  <BaseCode
    sx={{
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
