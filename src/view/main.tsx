import { Container, makeStyles } from '@material-ui/core';
import React from 'react';
import MyCampaignsList from '../component/Me/MyCampaignsList';
import NavBar from '../component/NavBar';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const MainView = () => {
  const classes = useStyles();
  return (
    <>
      <NavBar title="Epicteller" />
      <Container className={classes.container} maxWidth="lg">
        <MyCampaignsList />
      </Container>
    </>
  );
};

export default MainView;
