import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import './Navigation.css';

const styles = {
  button: {
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  list: {
    width: 280,
    flex: 'initial',
  },
  title: {
    marginTop: 15,
    marginBottom: 15,
  }
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};

    this.chapterList = null; // 章节列表 DOM 元素

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    let epub = this.props.epub;
    epub.getToc().then((chapters) => {
      this.chapterList = this.getChapters(chapters, false);
      this.bindEventForChapters();
    });
  }

  componentDidUpdate() {
    let toc = document.getElementById('toc');
    if (this.state.open && toc.firstElementChild !== this.chapterList) {
      toc.appendChild(this.chapterList);
    }
  }

  // 生成章节列表 DOM 元素
  getChapters(chapters, collapse) {
    let ul = document.createElement('ul');
    ul.className = collapse ? 'chapter-list collapse' : 'chapter-list expand';

    chapters.forEach((item) => {
      let li = document.createElement('li');
      li.className = 'chapter-list-item';
      let str;
      str = `<div class="item-content">
                <i class="item-mark"></i>
                <a class="chapter-url" href="${item.href}">${item.label}</a>
             </div>`;
      li.innerHTML = str;
      ul.appendChild(li);

      // 若章节还有子章节，递归生成目录（默认目录折叠）
      if (item.subitems && item.subitems.length) {
        li.appendChild(this.getChapters(item.subitems, true));
      }
    });

    return ul;
  }

  // 为章节列表 DOM 绑定事件处理程序
  bindEventForChapters() {
    this.chapterList.addEventListener('click', (event) => {
      let target = event.target;
      if (target.nodeName.toLowerCase() !== 'a') return;
      let href = target.getAttribute('href');
      this.props.epub.goto(href);
      event.preventDefault();
    });
  }

  // 打开章节列表
  handleOpen() {
    this.setState({open: true});
  }

  // 关闭章节列表
  handleClose() {
    this.setState({open: false});
  }

  render() {
    const classes = this.props.classes;

    return (
      <div id="navigation">
        <IconButton onClick={this.handleOpen} className={classes.button}>
          <MenuIcon/>
        </IconButton>
        <Drawer
          open={this.state.open}
          onRequestClose={this.handleClose}
          onClick={this.handleClose}
        >
          <div className={classes.title}>
            <Typography type="title" align="center">
              Table Of Contents
            </Typography>
          </div>
          <div id="toc" className={classes.list}>
          </div>
        </Drawer>
      </div>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
