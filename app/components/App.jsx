import React from 'react';
import Manager from './Manager';
import Viewer from './Viewer';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Config from "../service/Config";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReading: false, // 书籍是否正在被阅读
      readingBook: null, // 正在被阅读的书籍对象
      theme: Config.get().theme, // true为light主题，false为dark主题
    };

    this.handleReading = this.handleReading.bind(this);
    this.handleReadingBook = this.handleReadingBook.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  handleReading(isReading) {
    this.setState({isReading: isReading});
  }

  handleReadingBook(book) {
    this.setState({readingBook: book});
  }

  // 切换主题
  toggleTheme(theme) {
    this.setState({theme});
    Config.set('theme', theme);
  }

  render() {
    let {isReading, readingBook, theme} = this.state;

    const themeType = createMuiTheme({
      palette: {
        type: theme ? 'light' : 'dark',
      },
    });

    let manager = (
      <Manager handleReading={this.handleReading}
               handleReadingBook={this.handleReadingBook}
               theme={theme}
      />
    );
    let viewer = (
      <Viewer handleReading={this.handleReading}
              readingBook={readingBook}
              toggleTheme={this.toggleTheme}
              theme={theme}
      />
    );
    let element = isReading ? viewer : manager;

    let bgColor;
    if (isReading && theme) bgColor = Config.get().background || '#fff';
    else if (isReading && !theme) bgColor = '#424242';
    else if (!isReading && theme) bgColor = '#f1f2f3';
    else if (!isReading && !theme) bgColor = '#424242';
    document.body.style.backgroundColor = bgColor;

    return (
      <MuiThemeProvider theme={themeType}>
        <div id="app">
          {element}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
