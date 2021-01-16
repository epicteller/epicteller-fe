import { Box, makeStyles, Typography } from '@material-ui/core';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import React from 'react';

const useStyles = makeStyles(({ spacing, palette }) => ({
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  success: {
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
    color: palette.success.main,
    fontFamily: ['Consolas', 'Monaco', 'New Courier'].join(','),
  },
  error: {
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
    color: palette.error.main,
  },
}));

interface PropTypes {
  ping: number | null
}

export const PingBox = ({ ping }: PropTypes) => {
  const classes = useStyles();

  if (ping) {
    return (
      <Box className={classes.box}>
        <WifiIcon className={classes.success} fontSize="small" />
        <Typography variant="caption" className={classes.success}>
          {ping}
          ms
        </Typography>
      </Box>
    );
  }
  return (
    <Box className={classes.box}>
      <WifiOffIcon className={classes.error} fontSize="small" />
      <Typography variant="caption" className={classes.error}>
        未连接
      </Typography>
    </Box>
  );
};

export default PingBox;
