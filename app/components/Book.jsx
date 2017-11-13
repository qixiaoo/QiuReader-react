import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { orange } from 'material-ui/colors';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import Typography from 'material-ui/Typography';
import Palette from './Palette';
import './Book.css';
import Config from "../service/Config";

const styles = theme => ({
  book: {
    backgroundColor: theme.palette.background.paper,
  },
  text: {
    display: 'inline-block',
  },
  coverBorder: {
    borderColor: Config.get().theme ? '#000' : '#fff',
    outlineColor: Config.get().theme ? '#000' : '#fff',
  },
  button: {
    width: 28,
    height: 28,
  },
  icon: {
    color: '#fff',
    width: 20,
    height: 20,
    transition: 'color .3s',
    '&:hover': {
      color: orange[700],
    },
  }
});

class Book extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditBook = this.handleEditBook.bind(this);
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleOpenBook = this.handleOpenBook.bind(this);
  }

  handleEditBook() {
    console.log('clicked edit button');
    this.props.handleEdit(this.props.book);
  }

  handleDeleteBook() {
    console.log('clicked delete button');
    this.props.handleDelete(this.props.book.key);
  }

  handleOpenBook() {
    this.props.handleReadingBook(this.props.book);
    this.props.handleReading(true);
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={`book ${classes.book}`} data-key={this.props.book.key}>
        <div className="book-head">
          <div className={`cover ${classes.book}`}>
            <div className={`cover-border ${classes.coverBorder}`}>
              <div className="book-title">
                <Typography className={classes.text}>{this.props.book.name}</Typography>
              </div>
            </div>
          </div>
          <div className="mask-content">
            <div className="mask-top">
              <IconButton className={classes.button} onClick={this.handleDeleteBook}>
                <DeleteIcon className={classes.icon}/>
              </IconButton>
              <IconButton className={classes.button} onClick={this.handleEditBook}>
                <EditIcon className={classes.icon}/>
              </IconButton>
            </div>
            <div className="mask-bottom">
              <Palette><Button raised color="primary" onClick={this.handleOpenBook}>OPEN BOOK</Button></Palette>
            </div>
          </div>
          <div className="mask"/>
        </div>
        <div className="book-body">
          <div className="author-box">
            <Typography className={classes.text}>Author：</Typography>
            <Typography className={classes.text}>{this.props.book.author}</Typography>
          </div>
        </div>
      </div>
    );
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Book);
