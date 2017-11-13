import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {grey, orange} from 'material-ui/colors';
import IconButton from 'material-ui/IconButton';
import CopyIcon from 'material-ui-icons/ContentCut';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  head: {
    width: '100%',
    height: 60,
    padding: '0 30px',
    top: 0,
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: theme.palette.text.divider,
    backgroundColor: theme.palette.background.paper,
  },
  logo: {
    fontFamily: '\'Titillium Web\', sans-serif',
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
  },
  headRight: {
    display: 'flex',
  },
  icon: {
    width: 20,
    height: 20,
  },
  article: {
    overflowY: 'auto',
    width: '100vw',
    height: '100vh',
    marginTop: 60,
  },
  page: {
    width: 660,
    margin: '50px auto 0',
    fontFamily: '\'Helvetica Neue\', \'Arial\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei\', \'WenQuanYi Micro Hei\', sans-serif',
    color: theme.palette.text.primary,
  },
  title: {
    fontFamily: 'Georgia, Palatino, serif',
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '30px',
    textAlign: 'center',
    paddingBottom: 10,
  },
  note: {
    margin: '20px 0',
  },
  quote: {
    borderColor: orange[400],
    borderLeft: '6px solid',
    backgroundColor: grey[200],
    borderRadius: '5px',
    padding: '15px 10px',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  annotation: {
    marginTop: '20px',
    fontSize: '14px',
    paddingLeft: '16px',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ExportPanel extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.generateArticle = this.generateArticle.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  handleClose() {
    this.props.toggleExport(false);
  }

  // format为则true导出为plain text，否则导出为markdown
  generateArticle(format) {
    let {notes} = this.props;
    let article = '';
    let divider = format ? '\n*** *** ***\n\n' : '\n* * * * * *\n\n';

    notes.forEach((note) => {
      let fragment = format ? '' : '> ';
      fragment += note.text;
      fragment += '\n\n';
      fragment += note.note ? `${note.note}\n` : '';
      fragment += divider;
      article += fragment;
    });

    return article;
  }

  copyHandler = (event) => {
    let text = this.generateArticle(true);
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
    console.log('notes copied!');
    alert('Notes has been copied.');
  };

  // 复制纯文本
  handleCopy() {
    document.addEventListener('copy', this.copyHandler);
    document.execCommand('copy', false, null);
    setTimeout(() => {
      document.removeEventListener('copy', this.copyHandler);
    }, 1000);
  }

  render() {
    const { open, notes, book, classes } = this.props;

    return (
      <div id="export-panel">
        <Dialog
          fullScreen
          open={open}
          onRequestClose={this.handleClose}
          transition={Transition}
        >
          <div className={classes.head}>
            <div className={classes.logo}>
              Notes Preview
            </div>
            <div className={classes.headRight}>
              <Tooltip title="copy" placement="bottom">
                <IconButton onClick={this.handleCopy}>
                  <CopyIcon className={classes.icon}/>
                </IconButton>
              </Tooltip>
              <IconButton onClick={this.handleClose}>
                <CloseIcon/>
              </IconButton>
            </div>
          </div>
          <div className={classes.article}>
            <div className={classes.page}>
              <h1 className={classes.title}>{ book.name }</h1>
              {
                notes.map((note) => {
                  return (
                    <div key={note.key}>
                      <div className={classes.note}>
                        <blockquote className={classes.quote}>
                          {note.text}
                        </blockquote>
                        <p className={classes.annotation}>
                          {note.note}
                        </p>
                      </div>
                      <Divider/>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

ExportPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExportPanel);
