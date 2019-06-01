import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import './Navigation.css';
import ChapterList from "./ChapterList";

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
    this.state = {
      open: false,
      chapters: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.props.epub.getToc().then((chapters) => {
      this.setState({chapters});
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
    const {theme, classes, epub} = this.props;
    let fontColor = {
      color: theme ? '#000000de' : '#fff',
    };

    return (
      <div id="navigation">
        <IconButton onClick={this.handleOpen} className={classes.button}>
          <MenuIcon/>
        </IconButton>
        <Drawer
          open={this.state.open}
          onClose={this.handleClose}
          onClick={this.handleClose}
        >
          <div className={classes.title}>
            <Typography type="title" align="center">
              Table Of Contents
            </Typography>
          </div>
          <div id="toc" className={classes.list} style={fontColor}>
            <ChapterList
              chapters={this.state.chapters}
              collapse={false}
              epub={epub}
            />
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
