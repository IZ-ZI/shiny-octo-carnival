import React from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";

import Fallback from "./Fallbackpage";
import Login from "../components/Login";
import Register from "../components/Register";
import LostNFound from "../components/LostNFound";
import AppContainer from "../components/AppContainer";
import RegisterFailed from "../components/RegisterFailed";
import RegisterSuccess from "../components/RegisterSuccess";

class Landing extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Redirect from="/" to="/login" />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgot" component={LostNFound} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/success" component={RegisterSuccess} />
          <Route exact path="/register/failed" component={RegisterFailed} />
          <Route path="/appcontainer" component={AppContainer} />
          <Route path="*" component={Fallback} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default Landing;

