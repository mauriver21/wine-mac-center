import { Typography, TypographyProps } from 'reactjs-shared-ui';

export interface InfoBoldProps extends TypographyProps {}

export const InfoBold: React.FC<InfoBoldProps> = (props) => {
  return (
    <Typography variant="body2" fontWeight="bold" component="span" color="info.main" {...props} />
  );
};
