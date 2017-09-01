import React from 'react';
import Navigation from './Navigation';
import ViewArea from './ViewArea';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let epub = ePub({bookPath: this.props.readingBook.content, restore: false});

    return (
      <div id="viewer">
        <Navigation epub={epub}/>
        <ViewArea epub={epub}/>
      </div>
    );
  }
}

export default Viewer;
