import React from 'react';
import Container from '@material-ui/core/Container';
import { Box, makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import NavBar from './component/NavBar';
import Notifier from './component/Notifier';
import CombatView from './view/combat';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: {
    ...theme.mixins.toolbar,
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  container: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: theme.spacing(2),
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <Box>
      <Notifier />
      <NavBar />
      <Container className={classes.container} maxWidth="sm">
        <div className={classes.appBarSpacer} />
        <Switch>
          <Route path="/combat/:combatId">
            <CombatView />
          </Route>
        </Switch>
      </Container>
    </Box>
  );
}
