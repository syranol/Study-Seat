import React, { Component } from 'react';
import './app.scss';
import MapFrame from '../../components/map-frame/map-frame';

/**
 * renders the main view
 */
class App extends Component<any, any> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className="App">
            <header className="jumbotron container">      
                <h1>Study Seat</h1>
            </header>
            <div className="App-body"> 
                <MapFrame /> 
            </div>
        </div>);
    }
}

export default App;
