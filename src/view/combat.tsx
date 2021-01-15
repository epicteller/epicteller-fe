import { Box } from '@material-ui/core';
import camelcaseKeys from 'camelcase-keys';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CombatList from '../component/Combat/CombatList';
import { StoreContext } from '../store';
import { CombatMsg } from '../store/combat';

interface ParamTypes {
  combatId: string
}

const CombatView = observer(() => {
  const { combatId } = useParams<ParamTypes>();
  const { combatStore } = useContext(StoreContext);
  const [, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {
    combatStore.fetchCombatIfNeed(combatId);
  }, []);
  useEffect(() => {
    const wsClient = new WebSocket(`ws://api.epicteller.com/combats/${combatId}`);
    wsClient.onopen = (() => {
      setWs(wsClient);
    });
    wsClient.onmessage = ((e: MessageEvent) => {
      const data = JSON.parse(e.data);
      const message: CombatMsg = camelcaseKeys(data, { deep: true });
      combatStore.onMessage(message);
    });
    return () => {
      wsClient.close();
    };
  }, []);
  return (
    <Box>
      <CombatList store={combatStore} />
    </Box>
  );
});

export default CombatView;
