import React, { Component } from 'react';
import {
    Switch, Route, HashRouter
} from "react-router-dom";
import { Button } from "react-bootstrap";
import './app.scss';
import { connect } from "react-redux";
import { initialize } from 'state/actions/initialize.action';
import MapFrame from 'components/map-frame/map-frame';
import LoginForm from 'components/login-form/login-form';
import RegisterForm from 'components/register-form/register-form';
import { logoutSubmitted } from 'state/actions/logout.action';

/**
 * This component renders the main view, including the MapFrame
 */
class App extends Component<any, any> {

    constructor(props) {
        super(props);
        /**
         * on instantiation, load cached state (stored in browser localStorage)
         */
        this.loadStateFromLocalStorage();
    }

    /**
     * load cached state from browser localStorage
     *  - this allows persistent state across page reloads
     */
    private loadStateFromLocalStorage(): void {
        const cachedState = localStorage.getItem('studySeatState');
        if (cachedState === null) {
            return undefined;
        }
        /**
         * dispatch an initialization action to the store
         *  - passed through reducers to generate initial state
         */
        this.props.dispatch(initialize(JSON.parse(cachedState)));
    }

    private logout = () => {
        this.props.dispatch(logoutSubmitted(true));
    }

    /**
     * render the JSX template
     */
    render() {
        return (
            <div className="App">
                <header className="jumbotron container">
                    <div className="flex-row" style={{justifyContent: "flex-end"}}
                        >
                        <Button onClick={this.logout}>Log Out</Button>
                    </div>
                    <h1>StudySeat</h1>
                </header>
                <div className="App-body">
                    <HashRouter>
                        <Switch>
                            <Route path="/login" component={LoginForm}>
                            </Route>
                            <Route path="/register" component={RegisterForm}>
                            </Route>
                            <Route path="/" component={MapFrame}>
                            </Route>
                        </Switch>
                    </HashRouter>
                </div>
            </div>);
    }
}

/**
 * connect() allows components to connect to the global redux datastore
 *  - can map properties from store state to component props
 */
export default connect(null, null)(App);
