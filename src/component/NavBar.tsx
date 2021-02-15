import React, { useContext, useRef, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Container, Avatar, Button, ListItemIcon, MenuList, MenuItem, ClickAwayListener, Grow, Paper, Popper, ButtonBase } from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useMe } from '../hook';
import epAPI from '../api';
import { StoreContext } from '../store';

const useStyles = makeStyles((theme) => ({
  appBar: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  memberChip: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  menu: {
    marginTop: theme.spacing(3),
  },
  popper: {
    zIndex: 1300,
  },
}));

export interface NavBarProps {
  title?: string
}

const NavBar = observer(({ title = 'Epicteller' }: NavBarProps) => {
  const classes = useStyles();
  const me = useMe();
  const { me: store } = useContext(StoreContext);
  const history = useHistory();

  const chipRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = () => {
    setAnchorEl(chipRef.current);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    await epAPI.post('/logout');
    store.clearMe();
    history.push({ pathname: '/' });
  };

  const open = !!anchorEl;

  return (
    <>
      <AppBar className={classes.appBar} position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton edge="start" color="inherit" component={RouterLink} to="/">
              <DoubleArrow />
            </IconButton>
            <Typography className={classes.title} variant="h6">{title}</Typography>
            {me ? (
              <ButtonBase
                ref={chipRef}
                className={classes.memberChip}
                onClick={handleMenuOpen}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
              >
                <Avatar className={classes.avatar} src={me?.avatar}>{me?.name[0]}</Avatar>
                <Typography variant="subtitle1">{me?.name}</Typography>
              </ButtonBase>
            ) : (
              <Button component={RouterLink} to="/">登录</Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Popper
        onMouseEnter={handleMenuOpen}
        onMouseLeave={handleMenuClose}
        className={classes.popper}
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper className={classes.menu} elevation={6}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList>
                  <MenuItem component={RouterLink} to="/settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    设置
                  </MenuItem>
                  <MenuItem component={ButtonBase} onClick={logout}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    退出登录
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}

      </Popper>

      <div className={classes.appBarSpacer} />
    </>
  );
});

export default NavBar;
