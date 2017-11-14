import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import LeftArrow from 'material-ui-icons/NavigateBefore';
import RightArrow from 'material-ui-icons/NavigateNext';
import EditorToolbar from './EditorToolbar';
import NoteCard from './NoteCard';
import Util from '../service/Util';
import AutoBookmark from "../service/AutoBookmark";

let styles = {
  pageArea: {
    position: 'absolute',
    left: 80,
    right: 80,
    top: 0,
    bottom: 0,
  },
  button: {
    width: 70,
    height: 70,
    padding: 0,
  },
  arrow: {
    width: 50,
    height: 50,
  },
  prev: {
    position: 'absolute',
    left: 0,
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    transition: '.3s',
    '&:hover': {
      opacity: 1,
    },

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  next: {
    position: 'absolute',
    right: 0,
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    transition: '.3s',
    '&:hover': {
      opacity: 1,
    },

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

class ViewArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false, // 是否打开菜单
      openNoteCard: false, // 是否打开附注编辑框
      mPosX: 0, // 菜单的X轴坐标
      mPosY: 0, // 菜单的Y轴坐标
      nPosX: 0, // 附注输入框的X轴坐标
      nPosY: 0, // 附注输入框的Y轴坐标
      note: {}, // 当前正在被编辑的note
    };

    this.x = 0; // 计算菜单坐标时的中间结果
    this.y = 0; // 计算菜单坐标时的中间结果
    this.pen = null;
    this.notes = []; // 当前章节的note
    this.key = ''; // 当前正在渲染的note的key

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeNoteCard = this.closeNoteCard.bind(this);
    this.openNoteCard = this.openNoteCard.bind(this);
    this.renderNotes = this.renderNotes.bind(this);
    this.getPen = this.getPen.bind(this);
    this.setNote = this.setNote.bind(this);
    this.setKey = this.setKey.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.copyTextHack);
  }

  componentDidMount() {
    let page = document.getElementById('page-area');
    let {book, epub} = this.props;

    epub.renderTo(page); // 渲染
    this.bindEvent(); // 绑定事件
    epub.gotoCfi(AutoBookmark.getCfi(book.key)); // 跳转到上一次阅读位置

    // 解决火狐下不能正常复制
    this.copyTextHack = (event) => {
      let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
      let copyText = iDoc.getSelection().toString() || document.getSelection().toString();
      event.clipboardData.setData('text/plain', copyText);
      event.preventDefault();
    };
    document.addEventListener('copy', this.copyTextHack);
  }

  // 为阅读界面绑定事件
  bindEvent() {
    let epub = this.props.epub;
    let isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    let lock = false; // 暂时锁住翻页快捷键，避免快速点击产生的Bug

    let arrowKeys = event => {
      event.preventDefault();

      if (lock) return;

      if (event.keyCode === 37 || event.keyCode === 38) {
        epub.prevPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }

      if (event.keyCode === 39 || event.keyCode === 40) {
        epub.nextPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }
    };

    let mouseFirefox = event => {
      event.preventDefault();

      if (lock) return;

      if (event.detail < 0) {
        epub.prevPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }

      if (event.detail > 0) {
        epub.nextPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }
    };

    let mouseChrome = event => {
      event.preventDefault();

      if (lock) return;

      if (event.wheelDelta > 0) {
        epub.prevPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }

      if (event.wheelDelta < 0) {
        epub.nextPage();
        lock = true;
        setTimeout(function () {
          lock = false;
        }, 100);
        return false;
      }
    };

    let copyText = event => {
      let key = event.keyCode || event.which;
      if (key === 67 && event.ctrlKey) {
        let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
        let text = iDoc.execCommand('copy', false, null);
        !text ? console.log('failed to copy text to clipboard') : console.log(`copied!`);
      }
    };

    epub.on('renderer:chapterDisplayed', () => {

      this.getPen(); // 切换章节后获取 pen

      console.log('%c renderer:chapterDisplayed has been triggered! ', 'color: cyan; background: #333333');

      let doc = epub.renderer.doc;

      doc.addEventListener('click', this.openMenu); // 为每一章节内容绑定弹出菜单触发程序
      doc.addEventListener('keydown', arrowKeys, false); // 箭头按键翻页
      doc.addEventListener('keydown', copyText); // 解决 Ctrl + C 复制的bug

      // 鼠标滚轮翻页
      if (isFirefox)
        doc.addEventListener('DOMMouseScroll', mouseFirefox, false);
      else
        doc.addEventListener('mousewheel', mouseChrome, false);

      Util.addDefaultCss(); // 切换章节后为当前文档设置默认的样式
      Util.applyCss(); // 切换章节后应当为当前文档设置样式
      this.renderNotes(); // 切换章节后需要重新渲染注释
    });

    epub.on('renderer:visibleRangeChanged', () => {
      let {book, epub} = this.props;
      let bookKey = book.key;
      let cfi = epub.getCurrentLocationCfi();
      AutoBookmark.recordCfi(bookKey, cfi);
      console.log('auto bookmark: ', cfi);
    });
  }

  // 关闭弹出菜单
  closeMenu() {
    this.setState({openMenu: false});
  }

  // 打开弹出菜单
  openMenu(event) {
    let iframe = document.getElementsByTagName('iframe')[0];
    let iDoc = iframe.contentDocument;
    let sel = iDoc.getSelection();

    // 如果 note card 正在被展示，则隐藏
    if (this.state.openNoteCard) {
      this.setState({openNoteCard: false});
    }
    // 使弹出菜单更加灵活可控
    if (sel.isCollapsed) {
      this.state.openMenu && this.closeMenu();
      return;
    }

    if (this.props.disablePopup) return;

    let rect = this.props.epub.renderer.rangePosition(sel.getRangeAt(0));
    console.log(rect);

    let menu = document.getElementById('editor-toolbar');
    let x = event.clientX;
    let y = event.clientY;
    let width = parseInt(Util.getStyle(menu, 'width'));
    let height = parseInt(Util.getStyle(menu, 'height'));

    // TODO: 坐标计算
    let posX = rect.x + rect.width / 2 + width / 2;
    let posY = rect.y - height;
    posX = posX < 0 ? 0 : posX;
    posY = posY < 0 ? 0 : posY;

    [this.x, this.y] = [x, y];
    this.setState({openMenu: true, mPosX: posX, mPosY: posY});
  }

  // 关闭附注编辑框
  closeNoteCard() {
    this.setState({openNoteCard: false});
  }

  // 打开附注编辑框
  openNoteCard(x, y) {
    let noteCard = document.getElementById('note-card');
    let width = parseInt(Util.getStyle(noteCard, 'width'));
    let height = parseInt(Util.getStyle(noteCard, 'height'));

    console.log(width, height);

    let posX = x - (width / 2);
    let posY = y - height - 20;

    posX = posX < 0 ? 0 : posX;
    posY = posY < 0 ? 0 : posY;

    this.setState({openNoteCard: true, nPosX: posX, nPosY: posY});
  }

  // 设置当前正在被编辑的note
  setNote(note) {
    this.setState({note});
  }

  // 设置当前正在被渲染的note的key
  setKey(key) {
    this.key = key;
  }

  // 获取与本章节相关的 pen
  getPen() {
    // 注意点一
    // 为了每次切换章节时都有与当前文档相关联的 pen
    let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
    this.pen = rangy.createHighlighter(iDoc);
    let classes = ['color-0', 'color-1', 'color-2', 'color-3'];

    classes.forEach((item) => {
      let config = {
        ignoreWhiteSpace: true,
        elementTagName: 'span',
        elementProperties: {
          onclick: (event) => {
            let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
            let sel = iDoc.getSelection();
            if (!sel.isCollapsed) return;

            let {gutter, padding} = this.props;
            let key = event.currentTarget.dataset.key;
            let note = this.props.getNote(key);
            note || console.log('no note with key: ' + key);
            this.setNote(note);
            let [x, y] = [event.clientX + gutter, event.clientY + padding];
            this.openNoteCard(x, y);
            event.stopPropagation();

            if (this.state.openMenu) this.setState({openMenu: false}); // 修复bug
          },
        },
        onElementCreate: (element) => {
          element.dataset.key = this.key;
        },
      };
      let applier = rangy.createClassApplier(item, config);
      this.pen.addClassApplier(applier);
    });
  }

  // 渲染本章节的note
  renderNotes() {

    // TODO: 注意点二
    console.log('%c renderNotes has been called! ', 'color: cyan; background: #333333');

    let {epub, getNotesByChapter} = this.props;
    let chapter = epub.renderer.currentChapter;

    if (!chapter) return; // 初次打开书籍，页面尚未渲染

    this.notes = getNotesByChapter(chapter.spinePos);
    let notes = this.notes;
    let iframe = document.getElementsByTagName('iframe')[0];
    let iWin = iframe.contentWindow || iframe.contentDocument.defaultView;

    let sel = rangy.getSelection(iframe);
    let serial = rangy.serializeSelection(sel, true);

    this.pen && this.pen.removeAllHighlights(); // 为了避免下次反序列化失败，必须先清除已有的高亮

    let classes = ['color-0', 'color-1', 'color-2', 'color-3'];

    notes.forEach((note) => {
      this.key = note.key;
      try {
        let temp = JSON.parse(note.range);
        temp = [temp];
        rangy.getSelection(iframe).restoreCharacterRanges(iframe.contentDocument, temp);
      } catch (e) {
        console.warn('Exception has been caught when restore character ranges.');
        return;
      }

      this.pen.highlightSelection(classes[note.color]);
    });

    iWin.getSelection().empty(); // 清除文本选取
    this.state.openMenu && rangy.deserializeSelection(serial, null, iWin); // （为了选取文本后不被上一行代码清除掉）恢复原本的文本选取
  }

  // 翻页：上一页
  prev() {
    this.props.epub.prevPage();
    this.closeMenu();
    this.closeNoteCard();
  }

  // 翻页：下一页
  next() {
    this.props.epub.nextPage();
    this.closeMenu();
    this.closeNoteCard();
  }

  render() {
    const {epub, book, theme, colors, column, gutter, padding, addNote, updateNote, deleteNote, classes} = this.props;
    let style = {
      left: gutter,
      right: gutter,
      top: padding,
      bottom: padding,
    };

    epub.renderer.forceSingle(column === 1); // TODO: 在合适的地方触发重新渲染书籍
    console.log('%c render view-area. ', 'color: orange; background: #333333');
    this.renderNotes();

    return (
      <div id="view-area">
        <div id="page-area" className={classes.pageArea} style={style}/>
        <div id="prev" onClick={this.prev} className={classes.prev}>
          <IconButton className={classes.button}>
            <LeftArrow className={classes.arrow}/>
          </IconButton>
        </div>
        <div id="next" onClick={this.next} className={classes.next}>
          <IconButton className={classes.button}>
            <RightArrow className={classes.arrow}/>
          </IconButton>
        </div>
        <EditorToolbar open={this.state.openMenu}
                       posX={this.state.mPosX}
                       posY={this.state.mPosY}
                       closeMenu={this.closeMenu}
                       openNoteCard={this.openNoteCard}
                       addNote={addNote}
                       setKey={this.setKey}
                       book={book}
                       epub={epub}
                       theme={theme}
                       colors={colors}
                       pen={this.pen}
        />
        <NoteCard open={this.state.openNoteCard}
                  posX={this.state.nPosX}
                  posY={this.state.nPosY}
                  note={this.state.note}
                  theme={theme}
                  deleteNote={deleteNote}
                  updateNote={updateNote}
                  closeNoteCard={this.closeNoteCard}
        />
      </div>
    );
  }
}

ViewArea.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewArea);
