import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';

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
}));

interface NavBarProps {
  title: string
}

export default function NavBar({ title }: NavBarProps) {
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="菜单">
            <DoubleArrow />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />
    </div>
  );
}
