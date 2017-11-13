import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
  root: {
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 100,
  },
  card: {
    width: 200,
    boxShadow: '0 2px 15px rgba(0, 0, 0, .1)',
    padding: '10px 0',
  },
  bottom: {
    width: 14,
    height: 14,
    transform: 'rotate(45deg)',
    position: 'absolute',
    bottom: -7,
    left: 0,
    right: 0,
    margin: 'auto',
    zIndex: 99,
  },
  textarea: {
    fontFamily: 'sans-serif',
    fontSize: 12,
    border: 'none',
    outline: 'none',
    width: '100%',
    padding: '0 10px',
    minHeight: 60,
    backgroundColor: 'transparent',
    resize: 'none',
    '&::-webkit-input-placeholder': {
      fontStyle: 'italic',
    },
    '&::-moz-placeholder': {
      fontStyle: 'italic',
    },
  },
});

class NoteCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: this.props.note.note,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({note: nextProps.note.note});
  }

  handleChange(event) {
    this.setState({note: event.target.value});
  }

  handleBlur(event) {
    let note = this.props.note;
    note.note = event.target.value;
    this.props.updateNote(note);
    console.log('note has been updated.', note);
  }

  render() {
    const {posX, posY, open, theme, classes} = this.props;

    let root = {
      left: posX,
      top: posY,
      visibility: open ? 'visible' : 'hidden',
      background: theme ? '#424242' : '#f5f5f5',
    };
    let textArea = {
      color: theme ? '#f5f5f5' : '#424242',
    };
    let bottom = {
      background: theme ? '#424242' : '#f5f5f5',
    };

    return (
      <div id="note-card" className={classes.root} style={root}>
        <div className={classes.card}>
          <textarea type="text"
                    value={this.state.note}
                    className={classes.textarea}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    style={textArea}
                    placeholder="There is no note here."
          />
        </div>
        <div className={classes.bottom} style={bottom}/>
      </div>
    );
  }
}

NoteCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoteCard);
