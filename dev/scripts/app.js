import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SetUp from './setUp';
import ActiveSession from './activeSession';

class App extends React.Component {
    render() {
      return (
          <main>
            <SetUp />
          </main>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
