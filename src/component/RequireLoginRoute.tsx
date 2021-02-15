import { observer } from 'mobx-react-lite';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useMe } from '../hook';

interface props extends RouteProps {
  children: React.ReactNode
}

const RequireLoginRoute = observer(({ children, ...rest }: props) => {
  const me = useMe();
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (me ? (
        children
      ) : (
        <Redirect to={{ pathname: '/', state: { from: location } }} />
      ))}
    />
  );
});

export default RequireLoginRoute;
