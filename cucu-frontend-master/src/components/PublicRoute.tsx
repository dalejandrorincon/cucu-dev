import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin, getRole } from "../utils/session";

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? 
        (
          getRole() =="2" ?
          <Redirect to="/services" /> 
          :
          <Redirect to="/translators" /> 
        )
        : <Component {...props} />
      }
    />
  );
};
