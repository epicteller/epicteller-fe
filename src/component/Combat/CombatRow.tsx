import { Container as Box, Fade, IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { Draggable } from 'react-beautiful-dnd';
import { CombatStore, CombatToken } from '../../store/combat';

interface PropsType {
  store: CombatStore
  rank: number
  token: CombatToken
  isCurrentToken: boolean
}

const useStyles = makeStyles((theme) => ({
  cellBody: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: 0,
  },
  tokenCell: {
    padding: theme.spacing(0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenName: {
  },
  toolBtns: {
    flexDirection: 'row',
    marginRight: 0,
  },
}));

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    display: 'table',
  }),
});

const DraggableComponent = (id: string, index: number) => (props: any) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <TableRow
        ref={provided.innerRef}
        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.draggableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.dragHandleProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {props.children}
      </TableRow>
    )}
  </Draggable>
);

const initialState = {
  mouseX: null,
  mouseY: null,
};

const CombatRow = observer<PropsType>(({ store, rank, token, isCurrentToken }) => {
  const classes = useStyles();

  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const onMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const onMenuClose = () => {
    setState(initialState);
  };

  const removeToken = () => {
    store.removeToken(token);
    onMenuClose();
  };

  const setCurrentToken = () => {
    store.setCurrentToken(token);
    onMenuClose();
  };

  return (
    <TableRow selected={isCurrentToken} component={DraggableComponent(token.name, rank)}>
      <TableCell align="right">{rank + 1}</TableCell>
      <TableCell className={classes.cellBody}>
        <Box className={classes.tokenCell}>
          <div className={classes.tokenName}>
            {token.name}
          </div>

        </Box>
      </TableCell>
      <TableCell>
        {!isCurrentToken && (
        <div>
          <IconButton onClick={onMenuClick} size="small"><MoreVertIcon fontSize="inherit" /></IconButton>
          <Menu
            anchorReference="anchorPosition"
            anchorPosition={
                      state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                    }
            keepMounted
            open={state.mouseY !== null}
            onClose={onMenuClose}
            TransitionComponent={Fade}
          >
            <MenuItem dense onClick={removeToken}>
              <DeleteIcon fontSize="small" />
              移除
            </MenuItem>
            <MenuItem dense onClick={setCurrentToken}>
              <DoubleArrowIcon fontSize="small" />
              设为行动者
            </MenuItem>
          </Menu>
        </div>
        )}
      </TableCell>
      <TableCell align="right">{token.initiative}</TableCell>
    </TableRow>
  );
});

export default CombatRow;
