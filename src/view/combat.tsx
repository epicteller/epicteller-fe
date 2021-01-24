import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, makeStyles, Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import camelcaseKeys from 'camelcase-keys';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReconnectingWebSocket from 'reconnecting-websocket';
import CombatList from '../component/Combat/CombatList';
import PingBox from '../component/PingBox';
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
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2),
  },
  footerToolBtns: {
    justifyContent: 'flex-end',
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
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    combatStore.fetchCombatIfNeed(combatId);
  }, []);

  const [, setWs] = useState<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    let timer: any = null;
    let lastPing: number = 0;
    const wsClient = new ReconnectingWebSocket(`${REACT_APP_WS_BASE_URL}/combats/${combatId}`);

    const sendPing = () => {
      lastPing = Date.now();
      wsClient.send(JSON.stringify({ type: 'ping' }));
    };

    wsClient.addEventListener('open', () => {
      setWs(wsClient);
      sendPing();
      timer = setInterval(() => {
        sendPing();
      }, 10000);
    });
    wsClient.addEventListener('message', (e) => {
      const data: WebSocketMsg = camelcaseKeys(JSON.parse(e.data), { deep: true });
      if (data.type === 'pong') {
        runInAction(() => {
          combatStore.setWsPing(Date.now() - lastPing);
        });
        return;
      }
      combatStore.onMessage(data as CombatMsg);
    });

    wsClient.addEventListener('error', () => {
      runInAction(() => {
        combatStore.setWsPing(null);
      });
      clearInterval(timer);
    });

    wsClient.addEventListener('close', (e) => {
      clearInterval(timer);
      runInAction(() => {
        combatStore.setWsPing(null);
      });
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
    setDialogOpen(false);
  };

  const nextToken = () => {
    if (!combat || combat.state !== CombatState.RUNNING) {
      return;
    }
    combatStore.nextToken();
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
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
          <StepLabel optional={getStep(combatStore.combat) > 0 && <Typography variant="caption">{`第 ${combatStore.combat?.order.roundCount} 回合`}</Typography>}>
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
        <PingBox ping={combatStore.wsPing} />
        <Box className={classes.footerToolBtns}>
          {combat?.state === CombatState.INITIATING && (
          <Button variant="contained" color="secondary" onClick={runCombat}>进入行动阶段</Button>
          )}
          {combat?.state === CombatState.RUNNING && (
          <Box>
            <Button className={classes.btn} variant="contained" color="primary" onClick={nextToken}>下一行动轮</Button>
            <Button className={classes.btn} variant="contained" color="secondary" onClick={handleOpen}>结束战斗</Button>
            <Dialog open={dialogOpen} onClose={handleClose}>
              <DialogTitle>结束战斗</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  该操作无法撤销，是否确定要结束战斗？
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={endCombat} color="secondary">结束战斗</Button>
                <Button onClick={handleClose} color="primary">取消</Button>
              </DialogActions>
            </Dialog>
          </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
});

export default CombatView;
