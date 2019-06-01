import React from 'react';
import Book from './Book';

let style = {
  marginTop: 65,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '90%',
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
};

class BookList extends React.Component {

  render() {
    const bookItems = this.props.books.map(
      (item) => <Book key={item.key}
                      book={item}
                      handleEdit={this.props.handleEdit}
                      handleDelete={this.props.handleDelete}
                      handleReading={this.props.handleReading}
                      handleReadingBook={this.props.handleReadingBook}
                      theme={this.props.theme}/>
    );

    return (
      <div id="book-list" style={style}>
        {bookItems}
      </div>
    );
  }
}

export default BookList;
