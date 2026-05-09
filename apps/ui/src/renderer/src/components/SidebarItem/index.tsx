import { Body1, Icon, MenuItem, MenuItemProps } from 'reactjs-shared-ui';
import { MenuItem as MenuItemType } from '@interfaces/MenuItem';
import { styles } from './styles';

export interface SidebarItemProps extends MenuItemProps, MenuItemType {}

export const SidebarItem: React.FC<SidebarItemProps> = ({ text, icon, sx, ...rest }) => {
  return (
    <MenuItem sx={styles({ sx })} {...rest}>
      {() => (
        <>
          {icon ? <Icon color={'text.primary'} pr={1} render={icon} /> : <></>}
          <Body1 color={'text.primary'} fontWeight={500}>
            {text}
          </Body1>
        </>
      )}
    </MenuItem>
  );
};
