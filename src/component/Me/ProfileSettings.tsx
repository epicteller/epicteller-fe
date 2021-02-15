import { Button, Container, Divider, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import epAPI from '../../api';
import { useMe } from '../../hook';
import { StoreContext } from '../../store';
import { globalNotification } from '../../store/globalNotification';
import AvatarUploader from '../AvatarUploader';

interface uploadResponse {
  token: string
  url: string
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 3, 2, 3),
  },
  profileForm: {
    padding: theme.spacing(2, 1),
  },
  profileInput: {
    margin: theme.spacing(0.5, 0, 2, 0),
  },
  profileSubmitButton: {
    marginTop: theme.spacing(2),
  },

}));

const ProfileSettings = observer(() => {
  const classes = useStyles();
  const me = useMe();
  const { me: store } = useContext(StoreContext);

  const [name, setName] = useState(me?.name!);
  const [headline, setHeadline] = useState(me?.headline);
  const [avatarURL, setAvatarURL] = useState(me?.avatarOriginal);

  const onProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await epAPI.put('/me', { name, headline });
      store.refreshMe();
      globalNotification.success('修改成功');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    }
  };

  const onAvatarUpload = async (dataURL: string) => {
    const data = dataURL.replace(/^data:image\/\w+;base64,/, '');
    try {
      const response = await epAPI.post('/image-upload', { data });
      const avatarInfo = response.data as uploadResponse;
      await epAPI.put('/me', { avatar: avatarInfo.token });
      setAvatarURL(dataURL);
      store.refreshMe();
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! < 500) {
        globalNotification.error(err.response?.data?.message);
      } else {
        globalNotification.error('出错了，请稍后再试');
      }
    }
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>个人资料</Typography>
      <Divider />
      <Grid className={classes.profileForm} container spacing={4}>
        <Grid item xs sm={12} md={8}>
          <form onSubmit={onProfileSubmit}>
            <Typography variant="subtitle2">邮箱地址</Typography>
            <TextField
              className={classes.profileInput}
              variant="outlined"
              value={me?.email}
              fullWidth
              disabled
            />
            <Typography variant="subtitle2">用户名</Typography>
            <TextField
              className={classes.profileInput}
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Typography variant="subtitle2">一句话介绍</Typography>
            <TextField
              className={classes.profileInput}
              margin="normal"
              variant="outlined"
              multiline
              rowsMax={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              fullWidth
            />
            <Button
              className={classes.profileSubmitButton}
              variant="contained"
              color="primary"
              type="submit"
            >
              修改个人资料
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Container>
            <Typography variant="subtitle2" gutterBottom>头像</Typography>
            <AvatarUploader
              onUpload={onAvatarUpload}
              alt={me?.name}
              src={avatarURL}
              maxSizeBytes={10 * 1024 * 1024}
            />
          </Container>

        </Grid>
      </Grid>
    </Paper>
  );
});

export default ProfileSettings;
