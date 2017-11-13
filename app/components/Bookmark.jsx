import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { orange } from 'material-ui/colors';
import TextIcon from 'material-ui-icons/TextFields';
import RemoveIcon from 'material-ui-icons/RemoveCircleOutline';
import DoneIcon from 'material-ui-icons/Done';

const styles = theme => ({
  item: {
    padding: '0 10px',
    height: 40,
    overflow: 'hidden',
    transition: '.3s',
  },
  container: {
    margin: 0,
  },
  text: {
    '&:hover': {
      cursor: 'pointer',
      color: orange[700],
    },
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    borderBottom: '1px dotted black',
    '&:hover': {
      borderColor: orange[700],
    },
    '&:focus': {
      borderColor: orange[700],
    },
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  icon: {
    width: 21,
    height: 21,
    transition: '.3s',
    '&:hover': {
      cursor: 'pointer',
      color: orange[700],
    },
  },
});

class BookmarkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.item.label, // 书签展示的内容
      editable: false, // 是否可编辑书签内容
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // 点击书签，跳转到指定位置
  handleClick() {
    let {item, epub} = this.props;
    epub.gotoCfi(item.cfi);
    this.props.handleClose();
  }

  // 点击删除按钮的事件处理程序
  handleRemove() {
    let item = this.props.item;
    console.log('remove bookmark with key: ', item.key);
    this.props.deleteBookmark(item.key);
  }

  // 点击编辑按钮的事件处理程序
  handleEdit() {
    this.setState({editable: true});
  }

  // 点击保存按钮的事件处理程序
  handleSave() {
    let bookmark = this.props.item;
    bookmark.label = this.state.label;
    this.props.updateBookmark(bookmark);
    this.setState({editable: false});
  }

  // 编辑bookmark的label的处理程序
  handleChange(event) {
    this.setState({
      label: event.target.value
    });
  }

  render() {
    const classes = this.props.classes;

    let text = (
      <Typography noWrap className={classes.text} onClick={this.handleClick}>
        {this.state.label}
      </Typography>
    );
    let input = (
      <input type="text" value={this.state.label} onChange={this.handleChange} className={classes.input}/>
    );
    let editButton = (
      <TextIcon className={classes.icon} onClick={this.handleEdit}/>
    );
    let saveButton = (
      <DoneIcon className={classes.icon} onClick={this.handleSave}/>
    );
    let element = this.state.editable ? input : text;
    let button =  this.state.editable ? saveButton : editButton;

    return (
      <li className={classes.item}>
        <Grid container align="center" className={classes.container}>
          <Grid item xs={9}>
            <div>
              {element}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.button}>
              {button}
              <RemoveIcon className={classes.icon} onClick={this.handleRemove}/>
            </div>
          </Grid>
        </Grid>
      </li>
    );
  }
}

BookmarkItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BookmarkItem);
