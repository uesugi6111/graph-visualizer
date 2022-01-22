import React from 'react';
import './App.css';
import Graph from './graph';

const data: Array<any> = [];

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Graph data={data} />
            </header>
        </div>
    );
}

export default App;
