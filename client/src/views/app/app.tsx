import React, { Component } from 'react';
import logo from './logo.svg';
import './app.scss';
import MapFrame from '../../components/map-frame/map-frame';

/**
 * renders the main view
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="jumbotron">                    
                        <h1>Study Seat</h1>
                    </div>
                </header>
                <div className="App-body">
                    <div className="d-flex flex-column justify-items-center">
                        <MapFrame /> 
                    </div>
                </div>
            </div>);
    }
}

export default App;
