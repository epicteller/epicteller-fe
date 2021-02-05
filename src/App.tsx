import React from 'react';
import { Box, CssBaseline } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import Notifier from './component/Notifier';
import CombatView from './view/combat';
import MainView from './view/main';

export default function App() {
  return (
    <Box>
      <CssBaseline />
      <Notifier />
      <Switch>
        <Route path="/" exact>
          <MainView />
        </Route>
        <Route path="/combat/:combatId">
          <CombatView />
        </Route>
      </Switch>
    </Box>
  );
}
