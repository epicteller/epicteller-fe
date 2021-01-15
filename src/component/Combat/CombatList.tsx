import { Container, Paper, makeStyles } from '@material-ui/core';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { CombatStore, CombatToken } from '../../store/combat';
import CombatCard from './CombatCard';

interface PropTypes {
  store: CombatStore
}

const useStyles = makeStyles((theme) => ({
  list: {
    margin: theme.spacing(4, 0, 2),
  },
  inner: {
    padding: theme.spacing(2, 2, 1, 2),
  },
  rankCell: {
    minWidth: theme.spacing(1),
    textOverflow: 'ellipsis',
  },
  nameCell: {
    textOverflow: 'ellipsis',
    paddingRight: 0,
  },
  initCell: {
    textOverflow: 'ellipsis',
    paddingLeft: 0,
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
        <Paper ref={provided.innerRef} {...provided.droppableProps} {...props}>
          {props.children}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  </DragDropContext>
);

const CombatList = observer<PropTypes>((props: PropTypes) => {
  const classes = useStyles();
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

  return (
    <Container className={classes.list}>
      <Paper elevation={3} component={DroppableComponent(onDragEnd)} className={classes.inner}>
        {combat ? combat.order.order.map((token, index) => (
          <CombatCard
            key={token.name}
            store={store}
            rank={index}
            token={token}
            isCurrentToken={Boolean(combat.order.currentToken && combat.order.currentToken.name === token.name)}
          />
        )) : ''}
      </Paper>

    </Container>
  );
});

export default CombatList;
