import { Button, CircularProgress, Grid, InputAdornment, Link, makeStyles, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import epAPI from '../../api';
import { StoreContext } from '../../store';

interface RegisterInfo {
  email: string
}

interface ValidationError {
  loc: (string | number)[]
  type: string
  message: string
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
}));

const RegisterForm = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const classes = useStyles();

  const { globalNotification } = useContext(StoreContext);
  const [token, setToken] = useState(urlParams.get('token'));
  const [isTokenError, setTokenError] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [lockEmail, setLockEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [validationError, setValidationError] = useState<ValidationErrorResponse | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    setLockEmail(true);
    setIsValidatingToken(true);
    const fetchRegisterInfo = async () => {
      try {
        const response = await epAPI.get(`/auth/register?token=${token}`);
        setEmail((response.data as RegisterInfo).email);
      } catch (e) {
        setTokenError(true);
        setLockEmail(false);
        setToken(null);
      } finally {
        setIsValidatingToken(false);
      }
    };
    fetchRegisterInfo();
  }, []);

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
      await epAPI.post('/auth/validate/register', { email });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    }
    setIsSubmiting(false);
  };

  const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      return;
    }
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/auth/register', {
        validateToken: token,
        password,
        name,
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    }
  };

  const getError = (label: string): ValidationError | null => {
    if (!validationError) {
      return null;
    }
    const [err] = validationError.detail.filter((e) => e.loc[0] === label);
    if (!err) {
      return null;
    }
    return err;
  };

  return (
    <div className={classes.form}>
      {isTokenError && (
        <Alert onClose={() => setTokenError(false)} severity="error">邮箱验证链接已失效，请重试。</Alert>
      )}
      {!token ? (
        <form onSubmit={onValidateEmailSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
            label="邮箱地址"
            error={!!getError('email')}
            helperText={getError('email')?.message}
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
            disabled={lockEmail}
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
            发送验证邮件
          </Button>
          <Grid container justify="space-between" direction="row-reverse">
            <Grid item>
              <Link color="textSecondary" component={RouterLink} to="/" variant="body2">已有帐号？返回登录</Link>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={onRegister} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
            label="邮箱地址"
            error={!!getError('email')}
            helperText={getError('email')?.message}
            InputProps={{
              type: 'email',
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {
                isValidatingToken && (
                  <InputAdornment position="end">
                    <CircularProgress color="inherit" size="1.2rem" thickness={5} />
                  </InputAdornment>
                )
              }
                </>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="用户名"
            placeholder="其他人对你的称呼"
            error={!!getError('name')}
            helperText={getError('name')?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="密码"
            error={!!getError('password')}
            helperText={getError('password')?.message}
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
            注册
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
