import { Button } from '@components/Button';
import { Card, CardContent, Stack, Icon, H6, ContentsClass } from 'reactjs-shared-ui';

export interface LauncherConfigItemProps {
  icon: React.FC;
  label?: string;
  method: () => void;
}

export const LauncherConfigItem: React.FC<LauncherConfigItemProps> = ({ label, icon, method }) => {
  return (
    <Card>
      <CardContent>
        <Stack pt={1} direction="row" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Stack direction="row" minWidth={210} pb={1}>
              <Icon strokeWidth={0} size={34} render={icon} pr={1} />
              <H6 className={ContentsClass.ItemTitle}>{label}</H6>
            </Stack>
          </Stack>
          <Button onClick={method}>Open</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
