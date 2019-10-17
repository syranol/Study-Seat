import React, { Component } from 'react';
import logo from './logo.svg';
import './app.css';

class App extends Component {
    public async test() {
        try {
            console.log("FETCHING")
            const response = await fetch("/hello").then(res => res.json());
            alert(JSON.stringify(response));
        } catch (err) {
            alert(err);
        }
    }
    


    render() {
        setTimeout(this.test, 2000);

        return (
            <div className="App">
                <header className="App-header">

                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/app.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer">
                    Learn React
                </a>
                </header>
            </div>);
    }
}

export default App;
