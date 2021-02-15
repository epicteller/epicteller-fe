import { makeStyles, Paper, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useMe } from '../../hook';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 3, 4, 3),
  },
}));

const SecuritySettings = observer(() => {
  const classes = useStyles();
  const me = useMe();
  return (
    <Paper className={classes.paper}>
      <Typography variant="h5">帐号与安全</Typography>
      <Typography>{me?.name}</Typography>
    </Paper>
  );
});

export default SecuritySettings;
