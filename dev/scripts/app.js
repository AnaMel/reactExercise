import React from 'react';
import ReactDOM from 'react-dom';
import SetUp from './setUp.js';

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
