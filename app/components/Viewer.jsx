import React from 'react';
import Navigation from './Navigation';
import ViewArea from './ViewArea';
import Toolbar from './Toolbar';
import SettingsDialog from './SettingsDialog';
import Bookmarks from './Bookmarks';
import DBUtil from '../service/DBUtil';
import Notes from './Notes';
import Config from '../service/Config';
import Message from './Message';
import ExportPanel from './ExportPanel';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSettings: false, // 打开设置面板
      openBookmarks: false, // 打开书签列表
      openNotes: false, // 打开笔记列表
      openMessage: false, // 打开消息通知
      openExport: false, // 打开note导出面板
      bookmarks: [], // 书签列表
      notes: [], // note列表
      colors: Config.get().colors, // note的四种颜色
      background: Config.get().background, // 阅读区域的背景色
      gutter: Config.get().gutter, // 阅读区域两侧预留的间隔
      padding: Config.get().padding, // 阅读区域上下两侧预留的间隔
      fontSize: Config.get().fontSize, // 字体大小
      lineHeight: Config.get().lineHeight, // 行高
      letterSpacing: Config.get().letterSpacing, // 字间距
      wordSpacing: Config.get().wordSpacing, // 词间距（限英语）
      column: Config.get().column, // 列数
      disablePopup: Config.get().disablePopup, // 禁用弹出菜单
    };

    this.epub = null;

    this.toggleSettingsDialog = this.toggleSettingsDialog.bind(this);
    this.toggleBookmarks = this.toggleBookmarks.bind(this);
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleMessage = this.toggleMessage.bind(this);
    this.toggleExport = this.toggleExport.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.updateBookmark = this.updateBookmark.bind(this);
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.getNote = this.getNote.bind(this);
    this.getNotesByChapter = this.getNotesByChapter.bind(this);
    this.setConfig = this.setConfig.bind(this);
  }

  componentWillMount() {
    let dbAccess = new DBUtil('bookmarks', 'bookmark');
    dbAccess.open(
      () => {
        dbAccess.getAll(result => {
          let bookmarksArr;
          bookmarksArr = result.filter(item => item.bookKey === this.props.readingBook.key);
          this.setState({bookmarks: bookmarksArr});
        });
      }
    );

    let noteDBAccess = new DBUtil('notes', 'note');
    noteDBAccess.open(
      () => {
        noteDBAccess.getAll(result => {
          let noteArr;
          noteArr = result.filter(item => item.bookKey === this.props.readingBook.key);
          this.setState({notes: noteArr});
        });
      }
    );

    this.epub = ePub({bookPath: this.props.readingBook.content, restore: false});
  }

  componentDidMount() {
    rangy.init(); // 初始化
  }

  // 为state的属性设置相应的值
  setConfig(key, value) {
    this.setState({[key]: value});
    Config.set(key, value);
  }

  toggleSettingsDialog(open) {
    this.setState({openSettings: open});
  }

  toggleBookmarks(open) {
    this.setState({openBookmarks: open});
  }

  toggleNotes(open) {
    this.setState({openNotes: open});
  }

  toggleMessage(open) {
    this.setState({openMessage: open});
  }

  toggleExport(open) {
    this.setState({openExport: open});
  }

  // 添加书签
  addBookmark(bookmark) {
    let dbAccess = new DBUtil('bookmarks', 'bookmark');
    dbAccess.open(
      () => {
        dbAccess.add(bookmark);
        let bookmarksArr = this.state.bookmarks;
        bookmarksArr.push(bookmark);
        this.setState({bookmarks: bookmarksArr});
      }
    );
  }

  // 删除书签
  deleteBookmark(key) {
    let dbAccess = new DBUtil('bookmarks', 'bookmark');
    dbAccess.open(
      () => {
        dbAccess.remove(key);
        let bookmarksArr = this.state.bookmarks;
        bookmarksArr = bookmarksArr.filter(item => item.key !== key);
        this.setState({bookmarks: bookmarksArr});
      }
    );
  }

  // 更新书签内容
  updateBookmark(bookmark) {
    let dbAccess = new DBUtil('bookmarks', 'bookmark');
    dbAccess.open(
      () => {
        dbAccess.update(bookmark);
        let bookmarksArr = this.state.bookmarks;
        bookmarksArr.forEach((item, i, arr) => {
          if (item.key === bookmark.key)
            arr[i] = bookmark;
        });
        this.setState({bookmarks: bookmarksArr});
      }
    );
  }

  // 添加note
  addNote(note) {
    let dbAccess = new DBUtil('notes', 'note');
    dbAccess.open(
      () => {
        dbAccess.add(note);
        let noteArr = this.state.notes;
        noteArr.push(note);
        this.setState({notes: noteArr});
      }
    );
  }

  // 删除note
  deleteNote(key) {
    let dbAccess = new DBUtil('notes', 'note');
    dbAccess.open(
      () => {
        dbAccess.remove(key);
        let noteArr = this.state.notes;
        noteArr = noteArr.filter(item => item.key !== key);
        this.setState({notes: noteArr});
      }
    );
  }

  // 更新note内容
  updateNote(note) {
    let dbAccess = new DBUtil('notes', 'note');
    dbAccess.open(
      () => {
        dbAccess.update(note);
        let noteArr = this.state.notes;
        noteArr.forEach((item, i, arr) => {
          if (item.key === note.key)
            arr[i] = note;
        });
        this.setState({notes: noteArr});
      }
    );
  }

  // 获取指定key的note
  getNote(key) {
    let notes = this.state.notes;
    let target = null;

    notes.forEach((item) => {
      if (item.key === key) target = item;
    });

    return target;
  }

  // 获取指定章节的note
  getNotesByChapter(chapter) {
    let notes = this.state.notes;

    return notes.filter(item => item.chapter === chapter);
  }

  render() {
    let epub = this.epub;
    let {readingBook} = this.props;
    let { openSettings, openBookmarks, openNotes, openMessage, openExport, bookmarks, notes, colors, background, gutter, padding, fontSize, lineHeight, letterSpacing, wordSpacing, column, disablePopup } = this.state;

    return (
      <div id="viewer">
        <Navigation epub={epub}
                    theme={this.props.theme}
        />
        <ViewArea epub={epub}
                  book={this.props.readingBook}
                  addNote={this.addNote}
                  getNote={this.getNote}
                  deleteNote={this.deleteNote}
                  updateNote={this.updateNote}
                  getNotesByChapter={this.getNotesByChapter}
                  theme={this.props.theme}
                  background={background}
                  gutter={gutter}
                  padding={padding}
                  colors={colors}
                  column={column}
                  disablePopup={disablePopup}
        />
        <Toolbar handleReading={this.props.handleReading}
                 toggleMessage={this.toggleMessage}
                 toggleSettingsDialog={this.toggleSettingsDialog}
                 toggleBookmarks={this.toggleBookmarks}
                 toggleNotes={this.toggleNotes}
                 handleAddBookmark={this.addBookmark}
                 readingBook={this.props.readingBook}
                 epub={epub}
        />
        <Bookmarks open={openBookmarks}
                   toggleBookmarks={this.toggleBookmarks}
                   bookmarks={bookmarks}
                   deleteBookmark={this.deleteBookmark}
                   updateBookmark={this.updateBookmark}
                   getBookmark={this.getBookmark}
                   epub={epub}
        />
        <Notes open={openNotes}
               toggleNotes={this.toggleNotes}
               toggleExport={this.toggleExport}
               notes={notes}
               colors={colors}
               deleteNote={this.deleteNote}
               updateNote={this.updateNote}
               epub={epub}
        />
        <SettingsDialog open={openSettings}
                        toggleSettingsDialog={this.toggleSettingsDialog}
                        toggleTheme={this.props.toggleTheme}
                        setConfig={this.setConfig}
                        colors={colors}
                        background={background}
                        gutter={gutter}
                        padding={padding}
                        fontSize={fontSize}
                        lineHeight={lineHeight}
                        letterSpacing={letterSpacing}
                        wordSpacing={wordSpacing}
                        column={column}
                        disablePopup={disablePopup}
        />
        <Message open={openMessage} toggleMessage={this.toggleMessage}/>
        <ExportPanel open={openExport}
                     book={readingBook}
                     notes={notes}
                     theme={this.props.theme}
                     toggleExport={this.toggleExport}
        />
      </div>
    );
  }
}

export default Viewer;
