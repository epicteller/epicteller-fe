import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import CasinoIcon from '@material-ui/icons/Casino';

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
          <CasinoIcon />
        </IconButton>
        <Typography variant="h6">スカイクラッドの観测者</Typography>
      </Toolbar>
    </AppBar>
  );
}
