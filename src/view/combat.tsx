import { Box } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CombatList from '../component/Combat/CombatList';
import { StoreContext } from '../store';

interface ParamTypes {
  combatId: string
}

export default function CombatView() {
  const { combatId } = useParams<ParamTypes>();
  const { combatStore } = useContext(StoreContext);
  useEffect(() => {
    combatStore.fetchCombatIfNeed(combatId);
  });
  return (
    <Box>
      <CombatList store={combatStore} />
    </Box>
  );
}
