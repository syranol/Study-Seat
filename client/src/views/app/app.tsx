import React, { Component } from 'react';
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
                    <div className="d-flex flex-row align-items-center">
                        <MapFrame /> 
                        <div>
                            <div className="form-group">
                                <input></input><button className="btn btn-default">BUTTON</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>);
    }
}

export default App;
