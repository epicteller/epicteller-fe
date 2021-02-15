import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import NavBar from '../component/NavBar';
import MeSettingsList from '../component/Me/MeSettingsList';
import ProfileSettings from '../component/Me/ProfileSettings';
import ExternalSettings from '../component/Me/ExternalSettings';
import SecuritySettings from '../component/Me/SecuritySettings';
import { StoreContext } from '../store';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const MeSettingsView = observer(() => {
  const classes = useStyles();
  const match = useRouteMatch();
  const { me } = useContext(StoreContext);

  useEffect(() => {
    me.refreshMe();
  }, []);

  return (
    <>
      <NavBar title="Epicteller" />
      <Container className={classes.container} maxWidth="lg">
        <Typography variant="h4" gutterBottom>设置</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={3}>
            <MeSettingsList />
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Switch>
              <Route path={`${match.path}/profile`}>
                <ProfileSettings />
              </Route>
              <Route path={`${match.path}/security`}>
                <SecuritySettings />
              </Route>
              <Route path={`${match.path}/external`}>
                <ExternalSettings />
              </Route>
              <Route path={`${match.path}/`}>
                <Redirect to={`${match.path}/profile`} />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default MeSettingsView;
