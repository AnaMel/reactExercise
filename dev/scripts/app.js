import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SetUp from './setUp';

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
