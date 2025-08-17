import { SidebarItem } from '@components/SidebarItem';
import { MenuItem } from '@interfaces/MenuItem';
import { Box, BoxProps, MenuList, Stack, StackProps } from 'reactjs-shared-ui';

export interface SettingsSidebarProps extends BoxProps {
  menu: MenuItem[];
  spacing?: StackProps['spacing'];
}

export const Sidebar: React.FC<SettingsSidebarProps> = ({ menu = [], spacing = 1, ...rest }) => {
  return (
    <Box display="grid" {...rest}>
      <MenuList sx={{ paddingTop: 0 }}>
        <Stack spacing={spacing}>
          {menu.map((item, index) => (
            <SidebarItem
              key={index}
              linkProps={{ to: item.route }}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </Stack>
      </MenuList>
    </Box>
  );
};
