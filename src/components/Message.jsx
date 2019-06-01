import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

class Message extends React.Component {

  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.toggleMessage(false);
  }

  render() {
    let {open} = this.props;

    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={open}
        autoHideDuration={1000}
        onClose={this.handleClose}
        message={<span id="message">Add bookmark successfully.</span>}
        action={[
          <Button key="dismiss" color="secondary" size="small" onClick={this.handleClose}>
            DISMISS
          </Button>,
        ]}
      />
    );
  }
}

export default Message;
