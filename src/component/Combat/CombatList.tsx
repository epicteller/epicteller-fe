import { Container, makeStyles, Box, Typography, Button, List, DialogContent, DialogTitle, Dialog, DialogContentText, TextField, DialogActions } from '@material-ui/core';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import HistoryIcon from '@material-ui/icons/History';
import { CombatState, CombatStore, CombatToken } from '../../store/combat';
import CombatCard from './CombatCard';

interface PropTypes {
  store: CombatStore
}

const useStyles = makeStyles((theme) => ({
  list: {
    margin: theme.spacing(2, 0, 0),
    padding: 0,
  },
  inner: {
    padding: theme.spacing(2, 2, 1, 2),
  },
  listTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2, 2, 2),
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const DroppableComponent = (
  onDragEnd: (result: any, provided: any) => void,
) => (props: any) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="1" direction="vertical">
      {(provided) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <List ref={provided.innerRef} {...provided.droppableProps} {...props}>
          {props.children}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </DragDropContext>
);

const CombatList = observer<PropTypes>((props: PropTypes) => {
  const classes = useStyles();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [initiative, setInitiative] = useState<number>(0);
  const { store } = props;
  const { combat } = store;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !combat) {
      return;
    }
    const newOrder = reorder<CombatToken>(
      combat.order.order,
      result.source.index,
      result.destination.index,
    );
    store.reorderToken(newOrder);
  };

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const onAddDialogCancel = () => {
    setAddDialogOpen(false);
  };

  const isDuplicateToken = (name: string): boolean => {
    if (!combat) {
      return false;
    }
    const a = combat.order.order.map((i) => i.name);
    const has = a.includes(name);
    return has;
  };

  async function onAddDialogOK() {
    if (isDuplicateToken(tokenName)) {
      return;
    }
    const token: CombatToken = {
      name: tokenName,
      initiative,
    };
    await store.addToken(token);

    setAddDialogOpen(false);
    setTokenName('');
    setInitiative(0);
  }

  return (
    <Container className={classes.list}>
      <Box className={classes.listTitle}>
        <Box alignItems="center">
          <Typography variant="h6">
            先攻列表
          </Typography>
        </Box>
        <Box>
          <Button onClick={openAddDialog} variant="contained" color="primary" disabled={combat?.state === CombatState.ENDED}>追加</Button>
          <Dialog open={addDialogOpen} onClose={onAddDialogCancel}>
            <DialogTitle>追加先攻</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {combat?.state === CombatState.INITIATING && '战斗正在先攻阶段，新增顺位会按照先攻值的大小排序。'}
                {combat?.state === CombatState.RUNNING && '战斗正在行动阶段，新增顺位会直接进入顺位的末尾。'}
              </DialogContentText>
              <Box display="flex" justifyContent="space-between">
                <TextField
                  autoFocus
                  required
                  error={isDuplicateToken(tokenName)}
                  value={tokenName}
                  onChange={(e) => setTokenName(e.currentTarget.value)}
                  margin="dense"
                  label="名称"
                  helperText={isDuplicateToken(tokenName) && '名称重复'}
                  fullWidth
                />
                {combat?.state === CombatState.INITIATING && (
                  <TextField
                    required
                    value={initiative}
                    onChange={(e) => setInitiative(parseFloat(e.currentTarget.value))}
                    type="number"
                    margin="dense"
                    label="先攻值"
                    fullWidth
                  />
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onAddDialogCancel} color="primary">取消</Button>
              <Button onClick={onAddDialogOK} disabled={!tokenName || isDuplicateToken(tokenName)} color="primary">添加</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      {combat && combat.order.order.length > 0 ? (
        <List component={DroppableComponent(onDragEnd)}>
          {combat.order.order.map((token, index) => (
            <CombatCard
              key={token.name}
              store={store}
              rank={index}
              token={token}
              isCurrentToken={Boolean(combat.order.currentToken && combat.order.currentToken.name === token.name)}
            />
          ))}
        </List>
      ) : (
        <Box className={classes.empty}>
          <HistoryIcon fontSize="large" />
          <Typography>等待先攻中</Typography>
        </Box>
      )}
    </Container>
  );
});

export default CombatList;
