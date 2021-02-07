import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Notifier from './component/Notifier';
import CombatView from './view/combat';
import MainView from './view/main';

export default function App() {
  return (
    <>
      <Notifier />
      <Switch>
        <Route path="/" exact>
          <MainView />
        </Route>
        <Route path="/register" exact>
          <MainView />
        </Route>
        <Route path="/combat/:combatId">
          <CombatView />
        </Route>
      </Switch>
    </>
  );
}
