import React from 'react';
import Navbar from './Navbar';
import BookList from './BookList';
import EditBookDialog from './EditBookDialog';
import DBUtil from '../service/DBUtil';

class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [], // 书籍列表
      openEditDialog: false, // 是否打开编辑书籍信息的对话框
      targetBook: {} // 正在被编辑的书籍对象
    };
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleEditBook = this.handleEditBook.bind(this);
    this.handleUpdateBook = this.handleUpdateBook.bind(this);
    this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
  }

  componentWillMount() {
    let bookDBAccess = new DBUtil('books', 'book');
    let bookArr = [];
    bookDBAccess.open(
      () => {
        bookDBAccess.getAll(
          (result) => {
            bookArr = result;
            this.setState({books: bookArr});
          }
        );
      }
    );
  }

  handleAddBook(book) {
    let bookDBAccess = new DBUtil('books', 'book');
    bookDBAccess.open(
      () => {
        bookDBAccess.add(book);
        let bookArr = this.state.books;
        bookArr.push(book);
        this.setState({books: bookArr});
      }
    );
  }

  handleDeleteBook(key) {
    let bookDBAccess = new DBUtil('books', 'book');
    bookDBAccess.open(
      () => {
        bookDBAccess.remove(key);
        let bookArr = this.state.books;
        bookArr = bookArr.filter((item) => {
          return item.key !== key;
        });
        this.setState({books: bookArr});
      }
    );
  }

  handleEditBook(book) {
    this.setState({openEditDialog: true, targetBook: book});
  }

  handleUpdateBook(book) {
    let bookDBAccess = new DBUtil('books', 'book');
    bookDBAccess.open(
      () => {
        bookDBAccess.update(book);
        let bookArr = this.state.books;
        bookArr.forEach((item, i, arr) => {
          if (item.key === book.key)
            arr[i] = book;
        });
        this.setState({books: bookArr});
      }
    );
  }

  handleCloseEditDialog() {
    this.setState({openEditDialog: false});
  }

  render() {
    return (
      <div id="manager">
        <Navbar handleAddBook={this.handleAddBook}/>
        <BookList books={this.state.books} handleDelete={this.handleDeleteBook} handleEdit={this.handleEditBook} handleReading={this.props.handleReading} handleReadingBook={this.props.handleReadingBook}/>
        <EditBookDialog open={this.state.openEditDialog} book={this.state.targetBook} handleUpdateBook={this.handleUpdateBook} handleCloseEditDialog={this.handleCloseEditDialog}/>
      </div>
    );
  }
}

export default Manager;
