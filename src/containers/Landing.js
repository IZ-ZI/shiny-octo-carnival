import React from 'react';
import {
    BrowserRouter,
    Redirect,
    Switch,
    Route,
} from "react-router-dom";

import Login from '../components/Login';
import LostNFound from '../components/LostNFound';
import Register from '../components/Register';

class Landing extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Redirect exact from="/" to="/login" />
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/forgot" component={LostNFound} />
                    <Route exact path="/register" component={Register} />
                </Switch>
            </BrowserRouter>
        );
    }
}
export default Landing;