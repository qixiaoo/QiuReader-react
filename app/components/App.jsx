import React from 'react';
import Manager from './Manager';
import Viewer from './Viewer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReading: false, // 书籍是否正在被阅读
      readingBook: null // 正在被阅读的书籍对象
    };

    this.handleReading = this.handleReading.bind(this);
    this.handleReadingBook = this.handleReadingBook.bind(this);
  }

  handleReading(isReading) {
    this.setState({isReading: isReading});
  }

  handleReadingBook(book) {
    this.setState({readingBook: book});
  }

  render() {
    let manager = <Manager handleReading={this.handleReading} handleReadingBook={this.handleReadingBook}/>;
    let viewer = <Viewer handleReading={this.handleReading} readingBook={this.state.readingBook}/>;
    let element = this.state.isReading ? viewer : manager;
    return (
      <div id="app">
        {element}
      </div>
    );
  }
}

export default App;
