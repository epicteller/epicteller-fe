import { Box } from '@material-ui/core';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../store';

interface ParamTypes {
  combatId: string
}

export default function CombatView() {
  const { combatId } = useParams<ParamTypes>();
  const {combatStore} = useContext(StoreContext);
  return (
    <Box>
      <TableContainer>
        <Table>

        </Table>
      </TableContainer>
    </Box>
  );
}
