import React from 'react';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

class NoteCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidUpdate() {
    if (this.props.open)
      document.getElementById('note-input').focus();
  }

  // 点击保存附注触发
  handleSave() {
    console.log('note has been saved!');
    this.props.closeNoteCard();
  }

  // 点击取消触发
  handleCancel() {
    console.log('canceled!');
    this.props.closeNoteCard();
  }

  render() {
    let styles = {
      root: {
        position: 'absolute',
        width: 300,
        height: 200,
        visibility: 'hidden',
      },
      input: {
        minHeight: 100,
        width: '100%',
        resize: 'none',
      }
    };

    styles.root.left = this.props.posX;
    styles.root.top = this.props.posY;
    styles.root.visibility = this.props.open ? 'visible' : 'hidden';

    return (
      <div id="note-card" style={styles.root}>
        <Card>
          <CardContent>
            <textarea id="note-input" style={styles.input}/>
          </CardContent>
          <Divider/>
          <CardActions>
            <Button dense onClick={this.handleSave}>Save</Button>
            <Button dense onClick={this.handleCancel}>Cancel</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default NoteCard;
