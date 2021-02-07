import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Grid, InputAdornment, Link, makeStyles, TextField } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AxiosError } from 'axios';
import epAPI from '../../api';
import { StoreContext } from '../../store';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignInForm = () => {
  const classes = useStyles();
  const { me } = useContext(StoreContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const onSubmit = async () => {
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/auth/login', {
        email,
        password,
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! >= 500) {
        setErrorMessage('出错了，请稍后再试');
      } else {
        setErrorMessage(err.response?.data?.message);
      }
    }
    await me.refreshMe();
    setIsSubmiting(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        variant="outlined"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errorMessage}
        InputProps={{
          type: 'email',
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errorMessage}
        helperText={errorMessage}
        InputProps={{
          type: 'password',
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        className={classes.submit}
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
      >
        登录
      </Button>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/reset-password" variant="body2">忘记密码</Link>
        </Grid>
        <Grid item xs>
          <Link component={RouterLink} to="/register" variant="body2">注册帐号</Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignInForm;
