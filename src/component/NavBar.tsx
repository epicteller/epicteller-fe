import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  appBar: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="菜单">
          <DoubleArrow />
        </IconButton>
        <Typography variant="h6">战斗状态</Typography>
      </Toolbar>
    </AppBar>
  );
}
