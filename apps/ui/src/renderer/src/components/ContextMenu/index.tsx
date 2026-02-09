import { Menu, MenuItem } from '@mui/material';
import { Button, Icon } from 'reactjs-shared-ui';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export interface ContextMenuProps {
  menuItems?: Array<{ onClick?: () => void; label?: React.ReactNode }>;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ menuItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        sx={{ borderRadius: 2 }}
        equalSize={34}
        disableElevation={false}
        color="secondary"
        title="More Options"
        onClick={onOpen}
      >
        <Icon render={EllipsisVerticalIcon} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {menuItems?.map(({ onClick, label }) => (
          <MenuItem
            onClick={() => {
              onClick?.();
              onClose();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
