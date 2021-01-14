import { TableCell, TableRow } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CombatStore, CombatToken } from '../../store/combat';

interface PropsType {
  store: CombatStore
  rank: number
  token: CombatToken
}

const CombatRow = observer<PropsType>(({ store, rank, token }) => {
  const realRank = rank + 1;
  return (
    <TableRow key={token.name}>
      <TableCell align="right">{realRank}</TableCell>
      <TableCell>{token.name}</TableCell>
      <TableCell align="right">{token.initiative}</TableCell>
    </TableRow>
  );
});

export default CombatRow;
