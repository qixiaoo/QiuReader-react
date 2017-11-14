import React from 'react';
import DragHandleIcon from 'material-ui-icons/DragHandle';
import FullScreenIcon from 'material-ui-icons/Fullscreen';
import FullScreenExitIcon from 'material-ui-icons/FullscreenExit';
import SettingsIcon from 'material-ui-icons/Settings';
import FormatListBulletedIcon from 'material-ui-icons/FormatListBulleted';
import BookmarkIcon from 'material-ui-icons/Bookmark';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import NotesIcon from 'material-ui-icons/Sort';
import Draggable from './Draggable';
import Bookmark from "../model/Bookmark";
import './Toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullScreen: false, // 是否进入全屏模式
      show: false, // 是否显示
    };

    this.handleFullScreen = this.handleFullScreen.bind(this);
    this.handleExitFullScreen = this.handleExitFullScreen.bind(this);
    this.handleScreen = this.handleScreen.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleBookmarks = this.handleBookmarks.bind(this);
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  // 进入全屏模式
  handleFullScreen() {
    let de = document.documentElement;

    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullscreen) {
      de.webkitRequestFullscreen();
    } else if (de.msRequestFullscreen) {
      de.msRequestFullscreen();
    }

    this.setState({isFullScreen: true});
  }

  // 退出全屏模式
  handleExitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }

    this.setState({isFullScreen: false});
  }

  // 点击切换全屏按钮触发
  handleScreen() {
    !this.state.isFullScreen ? this.handleFullScreen() : this.handleExitFullScreen();
  }

  // 点击设置按钮的处理程序
  handleSettings() {
    this.props.toggleSettingsDialog(true);
  }

  // 点击notes按钮的事件处理程序
  handleNotes() {
    this.props.toggleNotes(true);
  }

  // 点击书签列表按钮的处理程序
  handleBookmarks() {
    this.props.toggleBookmarks(true);
  }

  // 点击添加书签按钮的处理程序
  handleAddBookmark() {
    let bookKey = this.props.readingBook.key;
    let epub = this.props.epub;
    let cfi = epub.getCurrentLocationCfi();
    let firstVisibleNode = epub.renderer.findFirstVisible();
    let label = firstVisibleNode.textContent;
    label = label && label.trim();
    label = label || cfi;
    let bookmark = new Bookmark(bookKey, cfi, label);
    this.props.handleAddBookmark(bookmark);
    this.props.toggleMessage(true);
  }

  // 点击退出按钮的处理程序
  handleExit() {
    this.props.handleReading(false);
  }

  // 显示toolbar
  show() {
    // TODO: 添加自动滑出显示的效果
    let show = true;
    this.setState({show});
  }

  // 隐藏toolbar
  hide() {
    // TODO: 添加自动滑入隐藏的效果
    let show = false;
    this.setState({show});
  }

  render() {
    let fullScreen = {
      display: this.state.isFullScreen ? 'none' : 'inline-block',
    };
    let exitFullScreen = {
      display: this.state.isFullScreen ? 'inline-block' : 'none',
    };
    let showToolbar = {
      opacity: this.state.show ? '1' : '.3',
    };
    let x = window.innerWidth - 300 - 20;
    let y = window.innerHeight - 40 - 40;

    return (
      <Draggable left={x} top={y}>
        <div id="toolbar" className="toolbar drag-me" onMouseOver={this.show} onMouseOut={this.hide} style={showToolbar}>
          <button className="toolbar-btn drag-me">
            <DragHandleIcon/>
          </button>
          <button className="toolbar-btn" onClick={this.handleScreen}>
            <span style={fullScreen}>
              <FullScreenIcon/>
            </span>
            <span style={exitFullScreen}>
              <FullScreenExitIcon/>
            </span>
          </button>
          <button className="toolbar-btn" title="settings" onClick={this.handleSettings}>
            <SettingsIcon/>
          </button>
          <button className="toolbar-btn" title="notes" onClick={this.handleNotes}>
            <NotesIcon/>
          </button>
          <button className="toolbar-btn" title="bookmark list" onClick={this.handleBookmarks}>
            <FormatListBulletedIcon/>
          </button>
          <button className="toolbar-btn" title="add bookmark" onClick={this.handleAddBookmark}>
            <BookmarkIcon/>
          </button>
          <button className="toolbar-btn" title="exit" onClick={this.handleExit}>
            <ExitToAppIcon/>
          </button>
        </div>
      </Draggable>

    );
  }
}

export default Toolbar;
