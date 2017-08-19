import React from 'react';
import Manager from './Manager';
import Viewer from './Viewer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isReading: false};

    this.handleReading = this.handleReading.bind(this);
  }

  handleReading(isReading) {
    this.setState({isReading: isReading});
  }

  render() {
    let manager = <Manager handleReading={this.handleReading}/>;
    let viewer = <Viewer handleReading={this.handleReading}/>;
    let element = this.state.isReading ? viewer : manager;
    return (
      <div id="app">
        {element}
      </div>
    );
  }
}

export default App;
