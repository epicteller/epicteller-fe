import { Grid, makeStyles, Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInForm from '../component/SignIn/SignInForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const MainView = observer(() => {
  const classes = useStyles();

  return (
    <>
      <Grid container component="main" className={classes.root}>
        <Grid item />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Switch>
            <Route path="/" exact>
              <SignInForm />
            </Route>
            
          </Switch>
        </Grid>
      </Grid>
    </>
  );
});

export default MainView;
