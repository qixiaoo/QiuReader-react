import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import AddIcon from 'material-ui-icons/Add';
import Book from '../service/Book';

const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 1px rgba(0, 0, 0, .15)',
  },
  logo: {
    fontFamily: '\'Titillium Web\', sans-serif',
    fontSize: '1.5rem',
  },
  button: {
    paddingTop: 6,
    paddingBottom: 6,
  }
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = e => {
      const epub = ePub({bookPath: e.target.result});
      epub.getMetadata().then((metadata) => {
        let name, author, content, description, book;
        [name, author, content, description] = [metadata.bookTitle, metadata.creator, metadata.description, e.target.result];
        book = new Book(name, author, content, description);
        this.props.handleAddBook(book);
      });
    };

    reader.onerror = () => {
      alert('Σ(っ °Д °;)っ Some error occured, please try again!');
    };
  }

  render() {
    const classes = this.props.classes;

    return (
      <div id="navbar">
        <AppBar position="fixed" className={classes.navbar}>
          <div className="container">
            <Toolbar>
              <Grid container align="center">
                <Grid item xs={6}>
                  <Grid container justify="flex-start" align="center">
                    <Grid item>
                      <Typography type="title" className={classes.logo}>
                        Qiu Plus
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="flex-end" align="center">
                    <Grid item>
                      <input accept="application/epub+zip" id="add-book" type="file" onChange={this.handleChange} hidden/>
                      <label htmlFor="add-book">
                        <Button component="span" aria-label="add" color="primary" className={classes.button}>
                          <AddIcon/>
                          add your book
                        </Button>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </div>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
