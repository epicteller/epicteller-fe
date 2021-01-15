import { Avatar, Card, Box, Fade, IconButton, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { Draggable } from 'react-beautiful-dnd';
import { deepOrange } from '@material-ui/core/colors';
import { CombatStore, CombatToken } from '../../store/combat';

interface PropsType {
  store: CombatStore
  rank: number
  token: CombatToken
  isCurrentToken: boolean
}

const useStyles = makeStyles(({ spacing, palette }) => {
  const family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  return {
    card: {
      display: 'flex',
      padding: spacing(2),
      minWidth: 288,
      borderRadius: 12,
      boxShadow: '0 2px 4px 0 rgba(138, 148, 159, 0.2)',
      '& > *:nth-child(1)': {
        marginRight: spacing(2),
      },
      '& > *:nth-child(2)': {
        flex: 'auto',
      },
      marginBottom: spacing(2),
    },
    avatar: {
      color: palette.getContrastText(deepOrange[500]),
    },
    heading: {
      fontFamily: family,
      marginBottom: 0,
    },
    subheader: {
      color: palette.grey[600],
      letterSpacing: '1px',
      marginBlockStart: 0,
      marginBottom: 4,
    },
    value: {
      marginLeft: 8,
      fontSize: 14,
      color: palette.grey[500],
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  };
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
  }),
});

const DraggableComponent = (id: string, index: number) => (props: any) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <Card
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
      </Card>
    )}
  </Draggable>
);

const initialState = {
  mouseX: null,
  mouseY: null,
};

const CombatCard = observer<PropsType>(({ store, rank, token, isCurrentToken }) => {
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
    <Card elevation={3} className={classes.card} component={DraggableComponent(token.name, rank)}>
      <Avatar className={classes.avatar}>{token.name[0]}</Avatar>
      <Box>
        <Typography variant="h6" className={classes.heading}>{token.name}</Typography>
        <p className={classes.subheader}>
          先攻值:
          {' '}
          {token.initiative}
        </p>
      </Box>

      <Box className={classes.footer}>
        {!isCurrentToken && (
        <IconButton onClick={onMenuClick}><MoreVertIcon fontSize="inherit" /></IconButton>
        )}
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
      </Box>
    </Card>
  );
});

export default CombatCard;
