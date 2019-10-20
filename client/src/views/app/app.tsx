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
                    <div className="d-flex flex-column align-items-center justify-content-space-between">
                        <div className="d-flex flex-row align-items-center justify-content-around"
                            style={{width:"50%"}}>
                            <div className="form-group-lg">
                                <div className="dropdown mb-2">
                                    <button className="btn btn-default dropdown-toggle" 
                                        id="selectBtn" type="button" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                            Looking for a
                                    </button>
                                    <div className="dropdown-menu" area-labelledby="selectBtn">
                                        <a className="dropdown-item" href="#">Coffee shop</a>
                                        <a className="dropdown-item" href="#">Library</a>
                                        <a className="dropdown-item" href="#">Other</a>
                                    </div>
                                </div>
                            </div>
                            {/* <span>within</span>
                            <div className="form-group-lg">
                                <input type="text" className="form-control input-lg mb-2"></input>
                            </div>
                            <span>of</span> */}
                            <span>in</span>
                            <div className="form-group-lg">
                                <input type="text" className="form-control input-lg mb-2"></input>
                            </div>
                            {/* <div className="flex-group-lg">
                                <button className="btn btn-default mb-2">Submit</button>
                            </div> */}
                        </div>
                        <MapFrame /> 
                    </div>

                </div>
            </div>);
    }
}

export default App;
