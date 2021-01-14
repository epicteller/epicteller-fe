import { Table, TableBody, TableCell, TableHead, TableRow, Container, Paper, TableContainer, makeStyles } from '@material-ui/core';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { CombatStore } from '../../store/combat';
import CombatRow from './CombatRow';

interface PropTypes {
  store: CombatStore
}

const useStyles = makeStyles((theme) => ({
  list: {
    margin: theme.spacing(4, 0, 2),
  },

}));

const CombatList = observer<PropTypes>((props: PropTypes) => {
  const classes = useStyles();
  const { store } = props;
  return (
    <Container className={classes.list}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right" width="20%">#</TableCell>
              <TableCell width="50%">名字</TableCell>
              <TableCell align="right" width="20%">先攻值</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.combat && store.combat.order.order.map((token, index) => (
              <CombatRow store={store} rank={index} token={token} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
});

export default CombatList;
