import { Paper, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import SecurityIcon from '@material-ui/icons/Security';
import LinkIcon from '@material-ui/icons/Link';

export interface menuItemProps {
  to: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const MenuItem = ({ children, to, style }: menuItemProps) => {
  const location = useLocation();
  return (
    <ListItem
      button
      selected={location.pathname === to}
      component={RouterLink}
      to={to}
      style={style}
    >
      {children}
    </ListItem>
  );
};

const MeSettingsList = () => {
  useEffect(() => {});
  return (
    <Paper>
      <List>
        <MenuItem to="/settings/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>
            个人资料
          </ListItemText>
        </MenuItem>
        <MenuItem to="/settings/security" style={{ display: 'none' }}>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText>
            帐号与安全
          </ListItemText>
        </MenuItem>
        <MenuItem to="/settings/external">
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText>
            外部帐号
          </ListItemText>
        </MenuItem>
      </List>
    </Paper>
  );
};

export default MeSettingsList;
