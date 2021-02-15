import { observer } from 'mobx-react-lite';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Notifier from './component/Notifier';
import RequireLoginRoute from './component/RequireLoginRoute';
import { useMe } from './hook';
import CombatView from './view/combat';
import MainView from './view/main';
import MeSettingsView from './view/MeSettings';
import SignInView from './view/SignIn';

const App = observer(() => {
  const me = useMe();
  return (
    <>
      <Notifier />
      <Switch>
        <Route path="/" exact>
          {me ? (
            <MainView />
          ) : (
            <SignInView />
          )}
        </Route>
        <Route path="/login" exact>
          <SignInView />
        </Route>
        <Route path="/register" exact>
          <SignInView />
        </Route>
        <Route path="/combat/:combatId" exact>
          <CombatView />
        </Route>
        <RequireLoginRoute path="/settings">
          <MeSettingsView />
        </RequireLoginRoute>
      </Switch>
    </>
  );
});

export default App;
