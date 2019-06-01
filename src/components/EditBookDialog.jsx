import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

class EditBookDialog extends React.Component {

  constructor(props) {
    super(props);

    this.handleSaveBook = this.handleSaveBook.bind(this);
  }

  handleSaveBook() {
    let book = this.props.book;
    book.name = document.getElementById('title').value;
    book.author = document.getElementById('author').value;
    this.props.handleUpdateBook(book);
    this.props.handleCloseEditDialog();
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Edit information</DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <Grid item xs={8}>
              <TextField
                id="title"
                label="Title"
                defaultValue={this.props.book.name}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="author"
                label="Author"
                defaultValue={this.props.book.author}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSaveBook} color="primary">
            Save
          </Button>
          <Button onClick={() => this.props.handleCloseEditDialog()} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditBookDialog;
