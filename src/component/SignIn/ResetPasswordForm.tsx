import { Button, Grid, Grow, InputAdornment, Link, makeStyles, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { AxiosError } from 'axios';
import React, { useContext, useState } from 'react';
import { useSearchParam } from 'react-use';
import epAPI from '../../api';
import { StoreContext } from '../../store';

interface ValidationError {
  loc: (string | number)[]
  type: string
  msg: string
}

interface ValidationErrorResponse {
  detail: ValidationError[]
}

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  successView: {
    textShadow: '0px 0px 5px black',
  },
}));

const ResetPasswordForm = () => {
  const classes = useStyles();
  const history = useHistory();

  const { globalNotification, me: meStore } = useContext(StoreContext);
  const [token] = useState(useSearchParam('token'));
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [validationError, setValidationError] = useState<ValidationErrorResponse | null>(null);

  const onValidateEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== repeatEmail) {
      return;
    }
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/validate/reset-password-email', { email });
      setSendEmailSuccess(true);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  const onResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      return;
    }
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/reset-password', {
        validateToken: token,
        password,
      });
      globalNotification.success('密码重置成功，请重新登录', 5000);
      meStore.refreshMe();
      history.push({ pathname: '/' });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  const getError = (label: string): ValidationError | null => {
    if (!validationError) {
      return null;
    }
    const [err] = validationError.detail.filter((e) => e.loc[1] === label);
    if (!err) {
      return null;
    }
    return err;
  };

  if (sendEmailSuccess) {
    return (
      <Grow in>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <Typography className={classes.successView} variant="h2">🎉</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.successView} variant="h6">已发送重置邮件</Typography>
          </Grid>
        </Grid>
      </Grow>
    );
  }

  return (
    <div className={classes.form}>
      {!token ? (
        <form onSubmit={onValidateEmailSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="邮箱地址"
            error={!!getError('email')}
            helperText={getError('email')?.msg}
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
            value={repeatEmail}
            onChange={(e) => setRepeatEmail(e.target.value)}
            label="确认邮箱地址"
            error={!!repeatEmail && email !== repeatEmail}
            helperText={!!repeatEmail && email !== repeatEmail && '两次邮箱输入不一致'}
            InputProps={{
              type: 'email',
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
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
            发送重置邮件
          </Button>
          <Grid container justify="space-between" direction="row-reverse">
            <Grid item>
              <Link color="textSecondary" component={RouterLink} to="/" variant="body2">返回登录</Link>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={onResetPassword} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="密码"
            error={!!getError('password')}
            helperText={getError('password')?.msg}
            InputProps={{
              type: 'password',
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!repeatPassword && password !== repeatPassword}
            helperText={!!repeatPassword && password !== repeatPassword ? '两次密码输入不一致' : ''}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            label="确认密码"
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
            重置密码
          </Button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
