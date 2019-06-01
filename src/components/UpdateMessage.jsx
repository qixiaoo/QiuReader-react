import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

class UpdateMessage extends React.Component {

  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.toggleUpdate(false);
    localStorage.setItem('update-message', '');
  }

  render() {
    let {open, message} = this.props;

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={open}
        autoHideDuration={8000}
        onClose={this.handleClose}
        message={<span id="update-message">{message}</span>}
        action={[
          <Button key="dismiss" color="secondary" size="small" onClick={this.handleClose}>
            DISMISS
          </Button>,
        ]}
      />
    );
  }
}

export default UpdateMessage;
