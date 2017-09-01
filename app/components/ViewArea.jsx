import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import LeftArrow from 'material-ui-icons/ArrowBack';
import RightArrow from 'material-ui-icons/ArrowForward';
import Menu from './Menu';
import NoteCard from './NoteCard';
import Util from '../service/Util';

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
      gutter: 80, // 阅读区域两侧预留的间隔
    };

    this.x = 0; // 计算菜单坐标时的中间结果
    this.y = 0; // 计算菜单坐标时的中间结果

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeNoteCard = this.closeNoteCard.bind(this);
    this.openNoteCard = this.openNoteCard.bind(this);
  }

  componentDidMount() {
    let page = document.getElementById('page-area');

    this.props.epub.renderTo(page); // 渲染
    this.bindEvent(); // 绑定事件
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

    epub.on('renderer:chapterDisplayed', () => {
      let doc = epub.renderer.doc;

      doc.addEventListener('click', this.openMenu); // 为每一章节内容绑定弹出菜单触发程序
      doc.addEventListener('keydown', arrowKeys, false); // 箭头按键翻页
      // 鼠标滚轮翻页
      if (isFirefox)
        doc.addEventListener('DOMMouseScroll', mouseFirefox, false);
      else
        doc.addEventListener('mousewheel', mouseChrome, false);
    });
  }

  // 关闭弹出菜单
  closeMenu() {
    this.setState({openMenu: false});
  }

  // 打开弹出菜单
  openMenu(event) {
    let iDoc = document.getElementsByTagName('iframe')[0].contentDocument;
    let sel = iDoc.getSelection();
    if (sel.isCollapsed) return;

    let page = document.getElementById('page-area');
    let menu = document.getElementById('menu');
    let x = event.clientX;
    let y = event.clientY - page.offsetTop;
    let width = parseInt(Util.getStyle(menu, 'width'));
    let height = parseInt(Util.getStyle(menu, 'height'));

    let posX = x > width ? x - width : x;
    let posY = y > height ? y - height : y;
    [this.x, this.y] = [x, y];
    this.setState({openMenu: true, mPosX: posX, mPosY: posY});
  }

  // 关闭附注编辑框
  closeNoteCard() {
    this.setState({openNoteCard: false});
  }

  // 打开附注编辑框
  openNoteCard() {
    let noteCard = document.getElementById('note-card');
    let x = this.x;
    let y = this.y;
    let width = parseInt(Util.getStyle(noteCard, 'width'));
    let height = parseInt(Util.getStyle(noteCard, 'height'));

    let posX = x > width ? x - width : x;
    let posY = y > height ? y - height : y;

    this.setState({openNoteCard: true, nPosX: posX, nPosY: posY});
  }

  // 翻页：上一页
  prev() {
    this.props.epub.prevPage();
  }

  // 翻页：下一页
  next() {
    this.props.epub.nextPage();
  }

  render() {
    const classes = this.props.classes;
    let gutter = {
      left: this.state.gutter,
      right: this.state.gutter,
    };

    return (
      <div id="view-area">
        <div id="page-area" className={classes.pageArea} style={gutter}/>
        <div id="prev" onClick={this.prev} className={classes.prev}>
          <IconButton className={classes.button}>
            <LeftArrow/>
          </IconButton>
        </div>
        <div id="next" onClick={this.next} className={classes.next}>
          <IconButton className={classes.button}>
            <RightArrow/>
          </IconButton>
        </div>
        <Menu open={this.state.openMenu}
              posX={this.state.mPosX}
              posY={this.state.mPosY}
              closeMenu={this.closeMenu}
              openNoteCard={this.openNoteCard}
        />
        <NoteCard open={this.state.openNoteCard}
                  posX={this.state.nPosX}
                  posY={this.state.nPosY}
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
