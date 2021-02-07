import { Button, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import epAPI from '../../api';

interface RegisterInfo {
  email: string
}

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const RegisterForm = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const classes = useStyles();

  const [token, setToken] = useState(urlParams.get('token'));
  const [isTokenError, setTokenError] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [lockEmail, setLockEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }
    setLockEmail(true);
    const fetchRegisterInfo = async () => {
      try {
        const response = await epAPI.get(`/auth/register?token=${token}`);
        setEmail((response.data as RegisterInfo).email);
      } catch (e) {
        setTokenError(true);
        setLockEmail(false);
        setToken(null);
      }
    };
    fetchRegisterInfo();
  }, []);

  const onValidateEmailSubmit = async () => {
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/auth/validate/register', { email });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! >= 500) {
        setErrorMessage('出错了，请稍后再试');
      } else {
        setErrorMessage(err.response?.data?.detail?.message);
      }
    }
    setIsSubmiting(false);
  };

  const onRegister = async () => {
    if (isSubmiting) {
      return;
    }
    setIsSubmiting(true);
    try {
      await epAPI.post('/auth/register', {
        
      });
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! >= 500) {
        setErrorMessage('出错了，请稍后再试');
      } else {
        setErrorMessage(err.response?.data?.detail?.message);
      }
    }
  };

  return (
    <>
      {isTokenError && (
        <Alert onClose={() => setTokenError(false)} severity="error">邮箱验证链接已失效，请重试。</Alert>
      )}
      {!token ? (
        <form onSubmit={onValidateEmailSubmit}>
          <TextField
            variant="outlined"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
            label="邮箱地址"
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
        </form>
      ) : (
        <form onSubmit={onRegister}>
          <TextField
            variant="outlined"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
            label="邮箱地址"
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
            value={name}
            onChange={(e) => setEmail(e.target.value)}
            label="用户名"
            placeholder="其他人对你的称呼"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="密码"
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
    </>
  );
};

export default RegisterForm;
