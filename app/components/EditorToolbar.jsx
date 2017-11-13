import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import { orange } from 'material-ui/colors';
import CopyIcon from 'material-ui-icons/ContentCut';
import Note from '../model/Note';

const styles = theme => ({
  root: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 40,
    padding: '0 10px',
    borderRadius: 20,
  },
  button: {
    cursor: 'pointer',
    padding: '0 8px',
  },
  dot: {
    display: 'inline-block',
    width: 20,
    height: 20,
    borderRadius: '50%',
    transition: 'transform .3s',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  icon: {
    '&:active': {
      color: orange[400],
    },
  },
  bottom: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderWidth: 10,
    borderStyle: 'solid',
    borderColor: 'transparent',
    left: '50%',
    marginLeft: '-10px',
    bottom: '-20px',
  },
});

class EditorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.createNote = this.createNote.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleCopyPlainText = this.handleCopyPlainText.bind(this);
  }

  // 根据选取的文本创建Note对象
  createNote(color) {
    let {book, epub} = this.props;
    let iframe = document.getElementsByTagName('iframe')[0];
    let iDoc = iframe.contentDocument;
    let sel = iDoc.getSelection();
    let range = sel.getRangeAt(0);
    let text = sel.toString();
    text = text && text.trim();
    let cfiBase = epub.renderer.currentChapter.cfiBase;
    let cfi = new EPUBJS.EpubCFI().generateCfiFromRange(range, cfiBase);
    let chapter = epub.renderer.currentChapter.spinePos;
    let bookKey = book.key;
    let charRange = rangy.getSelection(iframe).saveCharacterRanges(iDoc.body)[0];
    let serial = JSON.stringify(charRange);
    let note = new Note(bookKey, chapter, text, cfi, serial, color, '');

    return note;
  }

  // 关闭菜单
  closeMenu() {
    this.props.closeMenu();
  }

  // 点击添加高亮
  handleHighlight(event) {
    let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
    let color = parseInt(event.target.dataset.color);
    if (isNaN(color)) return;
    let note = this.createNote(color);
    let classes = ['color-0', 'color-1', 'color-2', 'color-3'];

    this.props.setKey(note.key); // 修复新添加的高亮没有正确的key的问题
    this.props.pen.highlightSelection(classes[color]);
    iDoc.getSelection().empty(); // 清空文本选取

    this.props.addNote(note);
    this.closeMenu();
    event.stopPropagation();

    console.log('%c Add note here. ', 'background-color: green');
  }

  // 点击复制为纯文本选项触发
  handleCopyPlainText() {
    let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
    let text = iDoc.execCommand('copy', false, null);
    !text ? console.log('failed to copy text to clipboard') : console.log('copied!');
    this.closeMenu();
  }

  render() {
    const {open, theme, posX, posY, colors, classes} = this.props;
    const root = {
      left: posX,
      top: posY,
      visibility: open ? 'visible' : 'hidden',
      backgroundColor: theme ? '#424242' : 'f5f5f5',
    };
    const bottom = {
      borderTopColor: theme ? '#424242' : '#f5f5f5',
    };
    const icon = {
      width: 20,
      height: 20,
      color: theme ? '#fff' : '#000',
    };

    return (
      <div id="editor-toolbar" className={classes.root} style={root}>
        <div className={classes.button} onClick={this.handleHighlight}>
          <span className={classes.dot} data-color="0" style={{backgroundColor: colors[0]}}/>
        </div>
        <div className={classes.button} onClick={this.handleHighlight}>
          <span className={classes.dot} data-color="1" style={{backgroundColor: colors[1]}}/>
        </div>
        <div className={classes.button} onClick={this.handleHighlight}>
          <span className={classes.dot} data-color="2" style={{backgroundColor: colors[2]}}/>
        </div>
        <div className={classes.button} onClick={this.handleHighlight}>
          <span className={classes.dot} data-color="3" style={{backgroundColor: colors[3]}}/>
        </div>
        <div className={classes.button} onClick={this.handleCopyPlainText}>
          <CopyIcon className={classes.icon} style={icon}/>
        </div>
        <div className={classes.bottom} style={bottom}/>
      </div>
    );
  }
}

EditorToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditorToolbar);
