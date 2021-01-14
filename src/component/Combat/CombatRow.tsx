import { IconButton, makeStyles, TableCell, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CombatStore, CombatToken } from '../../store/combat';

interface PropsType {
  store: CombatStore
  rank: number
  token: CombatToken
}

const useStyles = makeStyles(() => ({
  toolBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const CombatRow = observer<PropsType>(({ store, rank, token }) => {
  const classes = useStyles();
  const realRank = rank + 1;

  const removeToken = () => {
    store.removeCombatToken(token);
  };

  return (
    <TableRow key={token.name}>
      <TableCell align="right">{realRank}</TableCell>
      <TableCell>
        {token.name}
        <div className={classes.toolBtns}>
          <IconButton onClick={removeToken}><DeleteIcon fontSize="small" /></IconButton>
        </div>
      </TableCell>
      <TableCell align="right">{token.initiative}</TableCell>
    </TableRow>
  );
});

export default CombatRow;
