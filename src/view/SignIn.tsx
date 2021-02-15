import { createMuiTheme, Grid, makeStyles, MuiThemeProvider, Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegisterForm from '../component/SignIn/RegisterForm';
import SignInForm from '../component/SignIn/SignInForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundImage: 'url(/background.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    height: '100vh',
    padding: theme.spacing(0, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    backdropFilter: 'blur(10px) brightness(0.5)',
  },
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const SignInView = observer(() => {
  const classes = useStyles();

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          direction="row-reverse"
          justify="space-between"
          alignItems="center"
          className={classes.root}
        >
          <Grid className={classes.paper} item xs={12} md={5} lg={4} xl={3} component={Paper} elevation={12} square>
            <div>
              <Switch>
                <Route path="/" exact>
                  <SignInForm />
                </Route>
                <Route path="/register">
                  <RegisterForm />
                </Route>
              </Switch>
            </div>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </>
  );
});

export default SignInView;
