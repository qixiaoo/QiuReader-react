import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import Palette from './Palette';
import './Book.css';

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
    localStorage.setItem('reading', this.props.book.key);
    this.props.handleReading(true);
  }

  render() {
    return (
      <div className="book" data-key={this.props.book.key}>
        <div className="book-head">
          <div className="cover">
            <div className="cover-border">
              <div className="book-title">{this.props.book.name}</div>
            </div>
          </div>
          <div className="mask-content">
            <div className="mask-top">
              <IconButton id="delete-book" onClick={this.handleDeleteBook}><DeleteIcon/></IconButton>
              <IconButton id="edit-book" onClick={this.handleEditBook}><EditIcon/></IconButton>
            </div>
            <div className="mask-bottom">
              <Palette><Button raised color="primary" onClick={this.handleOpenBook}>OPEN BOOK</Button></Palette>
            </div>
          </div>
          <div className="mask"/>
        </div>
        <div className="book-body">
          <div className="author-box"><span>Author：</span><span>{this.props.book.author}</span></div>
        </div>
      </div>
    );
  }
}

export default Book;
