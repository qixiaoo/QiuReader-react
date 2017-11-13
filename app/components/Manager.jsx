import React from 'react';
import Navbar from './Navbar';
import BookList from './BookList';
import EditBookDialog from './EditBookDialog';
import UpdateMessage from './UpdateMessage';
import DBUtil from '../service/DBUtil';

class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [], // 书籍列表
      openEditDialog: false, // 是否打开编辑书籍信息的对话框
      openUpdate: true, // 是否打开更新消息
      targetBook: {} // 正在被编辑的书籍对象
    };
    this.handleAddBook = this.handleAddBook.bind(this);
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleEditBook = this.handleEditBook.bind(this);
    this.handleUpdateBook = this.handleUpdateBook.bind(this);
    this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
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
    // 从数据库中删除此book
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

    // 从数据库中删除本书的note
    let noteDBAccess = new DBUtil('notes', 'note');
    noteDBAccess.open(
      () => {
        noteDBAccess.getAll(result => {
          let noteArr;
          noteArr = result.filter(item => item.bookKey === key);
          noteArr.forEach((note) => {
            noteDBAccess.remove(note.key);
          });
        });
      }
    );

    // 从数据库中删除本书的bookmark
    let bmDBAccess = new DBUtil('bookmarks', 'bookmark');
    bmDBAccess.open(
      () => {
        bmDBAccess.getAll(result => {
          let bookmarksArr;
          bookmarksArr = result.filter(item => item.bookKey === key);
          bookmarksArr.forEach((bookmark) => {
            bmDBAccess.remove(bookmark.key);
          });
        });
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

  toggleUpdate(open) {
    this.setState({openUpdate: open});
  }

  render() {
    let {handleReading, handleReadingBook, theme} = this.props;
    let message = localStorage.getItem('update-message');
    let open = this.state.openUpdate && !!message;
    let classList = document.body.classList;
    let books = this.state.books;

    books.length ? classList.remove('show') : classList.add('show');

    return (
      <div id="manager">
        <Navbar handleAddBook={this.handleAddBook}/>
        <BookList books={books}
                  handleDelete={this.handleDeleteBook}
                  handleEdit={this.handleEditBook}
                  handleReading={handleReading}
                  handleReadingBook={handleReadingBook}
                  theme={theme}
        />
        <EditBookDialog open={this.state.openEditDialog}
                        book={this.state.targetBook}
                        handleUpdateBook={this.handleUpdateBook}
                        handleCloseEditDialog={this.handleCloseEditDialog}
        />
        <UpdateMessage open={open}
                       message={message}
                       toggleUpdate={this.toggleUpdate}
        />
      </div>
    );
  }
}

export default Manager;
