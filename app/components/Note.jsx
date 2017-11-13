import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import { grey, orange } from 'material-ui/colors';
import Typography from 'material-ui/Typography';
import ArrowIcon from 'material-ui-icons/ArrowForward';
import ClearIcon from 'material-ui-icons/Clear';

const styles = theme => ({
  item: {
    width: '90%',
    height: 80,
    padding: 10,
    margin: '15px auto',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    transition: '.3s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    }
  },
  noteContent: {
    width: '70%',
    flexGrow: '1',
  },
  input: {
    border: 'none',
    outline: 'none',
    color: grey[600],
    width: '100%',
    backgroundColor: 'transparent',
    borderBottom: '1px dotted black',
  },
  icon: {
    width: 18,
    height: 18,
    color: grey[700],
    display: 'block',
    transition: '.3s',
    '&:hover': {
      cursor: 'pointer',
      color: orange[700],
    },
  },
});

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: this.props.note.note, // note的内容
      editable: false, // 是否可编辑note内容
    };

    this.handleJump = this.handleJump.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleJump() {
    this.props.handleJump(this.props.note.cfi);
  }

  handleDelete() {
    this.props.deleteNote(this.props.note.key);
  }

  handleEdit() {
    this.setState({editable: true});
  }

  handleChange(event) {
    this.setState({note: event.target.value});
  }

  handleBlur(event) {
    let note = this.props.note;
    note.note = event.target.value;
    this.props.updateNote(note);
    this.setState({editable: false});
    console.log('note has been updated!');
  }

  render() {
    const {note, colors, classes} = this.props;
    let style = {
      backgroundColor: colors[note.color],
    };
    let margin = {
      marginTop: 15,
    };

    let text = (
      <Typography noWrap
                  color={'secondary'}
                  onClick={this.handleEdit}
      >
        {this.state.note}
      </Typography>
    );
    let input = (
      <input type="text"
             autoFocus="autofocus"
             value={this.state.note}
             className={classes.input}
             onChange={this.handleChange}
             onBlur={this.handleBlur}
      />
    );

    return (
      <li>
        <div style={style} className={classes.item}>
          <div className={classes.noteContent}>
            <div>
              <Typography noWrap type={'body2'}>{note.text}</Typography>
            </div>
            <div>
              {this.state.editable ? input : text}
            </div>
          </div>
          <div>
            <ClearIcon className={classes.icon} onClick={this.handleDelete}/>
            <ArrowIcon className={classes.icon} onClick={this.handleJump} style={margin}/>
          </div>
        </div>
      </li>
    );
  }
}

Note.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Note);
