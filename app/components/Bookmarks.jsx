import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';
import BookmarkItem from './Bookmark';

const styles = theme => ({
  title: {
    marginTop: 10,
  },
  list: {
    width: 280,
    padding: 0,
    listStyle: 'none',
    overflowX: 'hidden',
  },
});

class Bookmarks extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.toggleBookmarks(false);
  }

  render() {
    const classes = this.props.classes;

    return (
      <div id="bookmarks">
        <Drawer open={this.props.open} onRequestClose={this.handleClose}>
          <div className={classes.title}>
            <Typography type="headline" align="center" gutterBottom>Bookmarks</Typography>
          </div>
          <ul className={classes.list}>
            {
              this.props.bookmarks.map(item => {
                return (
                  <BookmarkItem
                    key={item.key}
                    item={item}
                    epub={this.props.epub}
                    handleClose={this.handleClose}
                    updateBookmark={this.props.updateBookmark}
                    deleteBookmark={this.props.deleteBookmark}
                  />
                );
              })
            }
          </ul>
        </Drawer>
      </div>
    );
  }
}

Bookmarks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Bookmarks);
