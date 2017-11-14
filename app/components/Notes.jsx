import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Note from './Note';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: 10,
  },
  list: {
    width: 280,
    padding: 0,
    listStyle: 'none',
    flexGrow: 2,
    overflowX: 'hidden',
  },
  foot: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 40,
    padding: '0 10px',
  },
});

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleJump = this.handleJump.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  handleClose() {
    this.props.toggleNotes(false);
  }

  handleJump(cfi) {
    this.props.epub.gotoCfi(cfi);
  }

  handleExport() {
    this.props.toggleExport(true);
  }

  render() {
    const {notes, colors, classes} = this.props;

    return (
      <div id="notes">
        <Drawer open={this.props.open} onRequestClose={this.handleClose} anchor="right" className={classes.root}>
          <div className={classes.title}>
            <Typography type="headline" align="center" gutterBottom>Notes</Typography>
          </div>
          <ul className={classes.list}>
            {
              notes.map((item) => {
                return (
                  <Note key={item.key}
                        note={item}
                        colors={colors}
                        deleteNote={this.props.deleteNote}
                        updateNote={this.props.updateNote}
                        handleJump={this.handleJump}
                  />
                );
              })
            }
          </ul>
          <Divider/>
          <div className={classes.foot}>
            <Button onClick={this.handleExport} color="accent" dense>
              export
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

Notes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notes);
