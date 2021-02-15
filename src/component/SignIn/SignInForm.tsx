import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Grid, InputAdornment, Link, makeStyles, TextField } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AxiosError } from 'axios';
import epAPI from '../../api';
import { StoreContext } from '../../store';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
  },
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/login', {
        email,
        password,
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! < 500) {
        setErrorMessage(err.response?.data?.message);
      } else {
        setErrorMessage('出错了，请稍后再试');
      }
    }
    await me.refreshMe();
    setIsSubmiting(false);
  };

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="邮箱地址"
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
        margin="normal"
        required
        fullWidth
        label="密码"
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
      <Grid container justify="space-between">
        <Grid item>
          <Link color="textSecondary" component={RouterLink} to="/reset-password" variant="body2">忘记密码？</Link>
        </Grid>
        <Grid item>
          <Link color="textSecondary" component={RouterLink} to="/register" variant="body2">注册帐号</Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignInForm;
