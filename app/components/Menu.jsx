import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card from 'material-ui/Card';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import DeleteIcon from 'material-ui-icons/Remove';
import CopyIcon from 'material-ui-icons/Texture';
import NoteIcon from 'material-ui-icons/Note';

const styles = theme => ({
  root: {
    width: 300,
    background: theme.palette.background.paper,
    zIndex: 10,
    position: 'absolute',
    visibility: 'hidden',
  },
});

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.closeMenu = this.closeMenu.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopyPlainText = this.handleCopyPlainText.bind(this);
  }

  // 关闭菜单
  closeMenu() {
    this.props.closeMenu();
  }

  // 点击添加附注的选项触发
  handleAddNote() {
    this.closeMenu();
    this.props.openNoteCard();
  }

  // 点击删除选项触发
  handleDelete() {
    console.log('deleted!');
    this.closeMenu();
  }

  // 点击复制为纯文本选项触发
  handleCopyPlainText() {
    console.log('copied!');
    this.closeMenu();
  }

  render() {
    const classes = this.props.classes;
    const menuStyle = {
      left: this.props.posX,
      top: this.props.posY,
      visibility: this.props.open ? 'visible' : 'hidden',
    };

    return (
      <div id="menu" className={classes.root} style={menuStyle}>
        <Card raised>
          <List>
            <ListItem button onClick={this.handleAddNote}>
              <ListItemIcon>
                <NoteIcon/>
              </ListItemIcon>
              <ListItemText primary="Add Note"/>
            </ListItem>
            <ListItem button onClick={this.handleDelete}>
              <ListItemIcon>
                <DeleteIcon/>
              </ListItemIcon>
              <ListItemText primary="Delete"/>
            </ListItem>
            <ListItem button onClick={this.handleCopyPlainText}>
              <ListItemIcon>
                <CopyIcon/>
              </ListItemIcon>
              <ListItemText primary="Copy"/>
            </ListItem>
          </List>
        </Card>
      </div>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);
