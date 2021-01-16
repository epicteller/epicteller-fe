import { Box, Button, Divider, makeStyles, Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import camelcaseKeys from 'camelcase-keys';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReconnectingWebSocket from 'reconnecting-websocket';
import CombatList from '../component/Combat/CombatList';
import { REACT_APP_WS_BASE_URL } from '../config';
import { StoreContext } from '../store';
import { Combat, CombatMsg, CombatState, WebSocketMsg } from '../store/combat';

interface ParamTypes {
  combatId: string
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginBlockStart: theme.spacing(4),
  },
  stepper: {
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2, 2),
  },
  btn: {
    marginLeft: theme.spacing(1),
  },
}));

const getStep = ((combat?: Combat): number => {
  if (!combat) {
    return 0;
  }
  switch (combat.state) {
    case CombatState.INITIATING:
      return 0;
    case CombatState.RUNNING:
      return 1;
    case CombatState.ENDED:
      return 4;
    default:
      return 0;
  }
});

const CombatView = observer(() => {
  const classes = useStyles();
  const { combatId } = useParams<ParamTypes>();
  const { combatStore } = useContext(StoreContext);
  const { combat } = combatStore;
  useEffect(() => {
    combatStore.fetchCombatIfNeed(combatId);
  }, []);

  const [, setWs] = useState<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    let timer: any = null;
    const wsClient = new ReconnectingWebSocket(`${REACT_APP_WS_BASE_URL}/combats/${combatId}`);
    wsClient.addEventListener('open', () => {
      setWs(wsClient);
      timer = setInterval(() => {
        wsClient.send(JSON.stringify({ type: 'ping' }));
      }, 10000);
    });
    wsClient.addEventListener('message', (e) => {
      const data: WebSocketMsg = camelcaseKeys(JSON.parse(e.data), { deep: true });
      if (data.type === 'pong') {
        return;
      }
      combatStore.onMessage(data as CombatMsg);
    });

    wsClient.addEventListener('error', () => {
      clearInterval(timer);
    });

    wsClient.addEventListener('close', (e) => {
      clearInterval(timer);
      if (e.code === 1000) {
        wsClient.close(1000);
      } else if (e.code === 1006) {
        wsClient.reconnect();
      }
    });

    return () => {
      clearInterval(timer);
      wsClient.close(1000);
    };
  }, []);

  const runCombat = () => {
    if (!combat || combat.state !== CombatState.INITIATING) {
      return;
    }
    combatStore.runCombat();
  };

  const endCombat = () => {
    if (!combat || combat.state === CombatState.ENDED) {
      return;
    }
    combatStore.endCombat();
  };

  const nextToken = () => {
    if (!combat || combat.state !== CombatState.RUNNING) {
      return;
    }
    combatStore.nextToken();
  };

  return (
    <Paper className={classes.container}>
      <Stepper activeStep={getStep(combatStore.combat)} className={classes.stepper}>
        <Step>
          <StepLabel optional={combatStore.combat?.state === CombatState.INITIATING && <Typography variant="caption">决定行动顺序</Typography>}>
            先攻阶段
          </StepLabel>
        </Step>
        <Step>
          <StepLabel optional={combatStore.combat?.state === CombatState.RUNNING && <Typography variant="caption">{`第 ${combatStore.combat?.order.roundCount} 回合`}</Typography>}>
            行动阶段
          </StepLabel>
        </Step>
        <Step>
          <StepLabel optional={combatStore.combat?.state === CombatState.ENDED && <Typography variant="caption">胜利了吗？</Typography>}>
            战斗结束
          </StepLabel>
        </Step>
      </Stepper>
      <Divider />
      <CombatList store={combatStore} />
      <Box className={classes.footer}>
        {combat?.state === CombatState.INITIATING && (
          <Button variant="contained" color="secondary" onClick={runCombat}>进入行动阶段</Button>
        )}
        {combat?.state === CombatState.RUNNING && (
          <Box>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={nextToken}>下一行动轮</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={endCombat}>战斗结束</Button>
          </Box>
        )}
        {combat?.state === CombatState.ENDED && (
          <Typography variant="caption">战斗已结束</Typography>
        )}
      </Box>
    </Paper>
  );
});

export default CombatView;
