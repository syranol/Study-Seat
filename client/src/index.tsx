import React from 'react';
import ReactDOM from 'react-dom';
import { 
    Route, Router, browserHistory,
    IndexRedirect
} from "react-router-dom";
import LoginForm from "components/login-form/login-form";
import RegisterForm from "components/register-form/register-form";

/**
 * import the bootstrap library (referenced this link)
 *  - https://blog.logrocket.com/how-to-use-bootstrap-with-react-a354715d1121/
 */
import 'bootstrap/dist/css/bootstrap.min.css';
/** these three dependencies allow use of Bootstrap JavaScript components */
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

/**
 * import React Redux bindings
 */
import { Provider } from "react-redux";
import store from "state/store/store";

import 'index.scss';
import App from './views/app/app';
import * as serviceWorker from 'serviceWorker';

/**
 * render the root element, wrapped in a provider which allows global access to the 
 *  redux store
 */
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root'));

// Toggle service worker (register or unregister). Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



