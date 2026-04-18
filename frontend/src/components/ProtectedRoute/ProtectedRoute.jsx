import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isGuestUser } from '../../utils/isGuest';

/**
 * noGuest — if true, guest users are redirected to /markets instead of rendered.
 */
const ProtectedRoute = ({ comp: Component, noGuest = false, ...rest }) => {
  const [user] = useState(JSON.parse(localStorage.getItem('profile')));
  return (
    <Route {...rest} render={({ props, location }) => {
      if (!user?.result) {
        return <Redirect to={{ pathname: '/auth', state: { from: location } }} />;
      }
      if (noGuest && isGuestUser()) {
        return <Redirect to='/markets' />;
      }
      return <Component {...props} {...rest} />;
    }} />
  );
};

export default ProtectedRoute;
