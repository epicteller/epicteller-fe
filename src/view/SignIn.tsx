import { createMuiTheme, Grid, Link, makeStyles, MuiThemeProvider, Paper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegisterForm from '../component/SignIn/RegisterForm';
import ResetPasswordForm from '../component/SignIn/ResetPasswordForm';
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
          <Grid className={classes.paper} item xs={12} md={5} lg={4} xl={3} component={Paper} elevation={12} square container direction="column" justify="space-between" alignItems="center">
            <Grid>
              <Switch>
                <Route path="/" exact>
                  <SignInForm />
                </Route>
                <Route path="/register">
                  <RegisterForm />
                </Route>
                <Route path="/reset-password">
                  <ResetPasswordForm />
                </Route>
              </Switch>
            </Grid>
            <Grid>
              <Link color="textSecondary" variant="caption" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">京ICP备2021025369号-1</Link>
            </Grid>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </>
  );
});

export default SignInView;
