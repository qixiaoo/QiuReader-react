import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {grey, orange, green} from 'material-ui/colors';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import SunIcon from 'material-ui-icons/Brightness5';
import MoonIcon from 'material-ui-icons/Brightness4';
import StyleIcon from 'material-ui-icons/Stars';
import ResetIcon from 'material-ui-icons/Restore';
import Tooltip from 'material-ui/Tooltip';
import Config from "../service/Config";
import Util from "../service/Util";

const styles = theme => ({
  root: {

  },
  card: {
    minWidth: 400,
    minHeight: 60,
    padding: 10,
    margin: '15px auto',
    boxShadow: theme.shadows[1],
    transition: 'box-shadow .3s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
  icon: {
    color: grey[700],
    '&:hover': {
      color: orange[700],
      cursor: 'pointer',
    },
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20 0 10',
  },
  colorBox: {
    width: 360,
    padding: '20px 0 10px',
    margin: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  colorItem: {
    width: '45%',
    margin: '5px 0',
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    display: 'inline-block',
    borderRadius: '50%',
    border: '1px solid black',
    marginRight: 8,
  },
  input: {
    outline: 'none',
    border: 'none',
    width: '80%',
    borderBottom: '1px dotted black',
    backgroundColor: 'transparent',
    transition: '.3s',
    '&:hover': {
      borderColor: orange[700],
    },
    '&:focus': {
      borderColor: orange[700],
    },
  },
  controlBox: {
    width: 360,
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px',
  },
  caption: {
    width: '15%',
    marginRight: 20,
    fontSize: 'small',
    textAlign: 'right',
    color: grey[700],
  },
  checked: {
    color: green[500],
  },
  hide: {
    display: 'none',
  }
});

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props);

    let { colors, background, gutter, padding, fontSize, lineHeight, letterSpacing, wordSpacing, column, disablePopup } = this.props;
    this.state = {
      colors: colors,
      background: background,
      gutter: gutter,
      padding: padding,
      fontSize: fontSize,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      wordSpacing: wordSpacing,
      column: column,
      disablePopup: disablePopup,
    };

    this.handleClose = this.handleClose.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.changeColors = this.changeColors.bind(this);
    this.changeColumn = this.changeColumn.bind(this);
    this.changeGutter = this.changeGutter.bind(this);
    this.changePadding = this.changePadding.bind(this);
    this.changeFontConfig = this.changeFontConfig.bind(this);
    this.changeUserStyle = this.changeUserStyle.bind(this);
    this.resetUserStyle = this.resetUserStyle.bind(this);
    this.disablePopup = this.disablePopup.bind(this);
    this.handleColorsChange = this.handleColorsChange.bind(this);
    this.handleOtherChange = this.handleOtherChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { colors, background, gutter, padding, fontSize, lineHeight, letterSpacing, wordSpacing, column, disablePopup } = nextProps;
    this.setState({
      colors: colors,
      background: background,
      gutter: gutter,
      padding: padding,
      fontSize: fontSize,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      wordSpacing: wordSpacing,
      column: column,
      disablePopup: disablePopup,
    });
  }

  handleClose() {
    this.props.toggleSettingsDialog(false);
  }

  handleColorsChange(event) {
    let index = parseInt(event.target.dataset.color);
    let colors = this.state.colors;
    colors[index] = event.target.value;
    this.setState({colors});
  }

  handleOtherChange(event) {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  // 改变主题
  changeTheme(theme) {
    this.props.toggleTheme(theme);
    let colors1 = Config.getDefaultConfigObj().colors;
    let colors2 = ['#F44336', '#F57F17', '#8BC34A', '#2196F3'];
    let colors = theme ? colors1 : colors2;
    this.props.setConfig('colors', colors);
    Util.addDefaultCss(); // 改变了设置，需要为当前页重新应用样式
  }

  // 改变高亮的颜色
  changeColors(event) {
    let colors = Config.get().colors;
    let value = event.target.value;
    let i = parseInt(event.target.dataset.color);
    colors[i] = value;
    this.props.setConfig('colors', colors);
    console.log(`change highlight color ${i} to ${value}`);
    Util.addDefaultCss(); // 改变了颜色，需要为当前页重新应用样式
  }

  // 改变可阅读区域列数
  changeColumn(event, value) {
    value = value ? 1 : 2;
    this.props.setConfig('column', value);
    console.log(`change column to ${value}`);
    // TODO: 为单双列模式设置合适的gutter值
  }

  // 改变gutter的值
  changeGutter(event) {
    let value = parseInt(event.target.value);
    this.props.setConfig('gutter', value);
    console.log(`change gutter to ${value}`);
    // TODO: 添加数值验证（不小于80）
  }

  // 改变padding的值
  changePadding(event) {
    let value = parseInt(event.target.value);
    this.props.setConfig('padding', value);
    console.log(`change padding to ${value}`);
    // TODO: 添加数值验证（不小于10）
  }

  // 改变与字体相关的配置
  changeFontConfig(event) {
    let name = event.target.name;
    let value = event.target.value;
    let num;

    if (value === 'default') {
      num = 0;
    } else if (value !== 'default' && isNaN(value)) {
      alert('Invalid value!');
      return;
    } else {
      num = parseInt(value);
    }

    this.props.setConfig(name, num);
    console.log(`change ${name} to ${num}`);
    // TODO: 添加数值校验
    Util.addDefaultCss(); // 改变了设置，需要为当前页重新应用样式
  }

  // 导入用户自定义样式
  changeUserStyle(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file.type.indexOf('text') === -1) {
      alert('Invalid stylesheet!');
      return;
    }
    reader.readAsText(file);

    reader.onerror = () => alert('Error! Please refresh the page and try again.');
    reader.onload = () => {
      alert('The stylesheet has been imported.');
      let style = Util.parseStyle(reader.result);
      console.log(style);
      localStorage.setItem('style', JSON.stringify(style));
      Util.applyCss();
    };
  }

  // 重置为默认样式
  resetUserStyle() {
    let config = Config.getDefaultConfigObj();
    this.props.setConfig('colors', config.colors);
    this.props.setConfig('padding', config.padding);
    this.props.setConfig('gutter', config.gutter);
    this.props.setConfig('fontSize', config.fontSize);
    this.props.setConfig('lineHeight', config.lineHeight);
    this.props.setConfig('letterSpacing', config.letterSpacing);
    this.props.setConfig('wordSpacing', config.wordSpacing);
    Util.resetStyle();
  }

  // 禁用 popup menu
  disablePopup(event, value) {
    this.props.setConfig('disablePopup', value);
    console.log(`disable popup menu: ${value}`);
  }

  render() {
    let { classes } = this.props;
    let { colors, background, gutter, padding, fontSize, lineHeight, letterSpacing, wordSpacing, column, disablePopup } = this.state;

    let style = {
      color0: {
        backgroundColor: colors[0],
      },
      color1: {
        backgroundColor: colors[1],
      },
      color2: {
        backgroundColor: colors[2],
      },
      color3: {
        backgroundColor: colors[3],
      },
    };

    return (
      <div id="settings">
        <Dialog open={this.props.open} onRequestClose={this.handleClose} className={classes.root}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <div className={classes.card} style={style.color0}>
              <div>
                <Typography align="left" type="subheading">theme</Typography>
                <Divider/>
              </div>
              <div className={classes.box}>
                <Tooltip placement="bottom" title="light theme">
                  <SunIcon className={classes.icon} onClick={() => this.changeTheme(true)}/>
                </Tooltip>
                <Tooltip placement="bottom" title="dark theme">
                  <MoonIcon className={classes.icon} style={{marginLeft: 60}} onClick={() => this.changeTheme(false)}/>
                </Tooltip>
              </div>
            </div>
            <div className={classes.card} style={style.color1}>
              <div>
                <Typography align="left" type="subheading">color</Typography>
                <Divider/>
              </div>
              <div>
                <div className={classes.colorBox} onBlur={this.changeColors} onChange={this.handleColorsChange}>
                  <div className={classes.colorItem}>
                    <span className={classes.dot} style={{backgroundColor: colors[0]}}/>
                    <input className={classes.input} data-color="0" value={colors[0]}/>
                  </div>
                  <div className={classes.colorItem}>
                    <span className={classes.dot} style={{backgroundColor: colors[1]}}/>
                    <input className={classes.input} data-color="1" value={colors[1]}/>
                  </div>
                  <div className={classes.colorItem}>
                    <span className={classes.dot} style={{backgroundColor: colors[2]}}/>
                    <input className={classes.input} data-color="2" value={colors[2]}/>
                  </div>
                  <div className={classes.colorItem}>
                    <span className={classes.dot} style={{backgroundColor: colors[3]}}/>
                    <input className={classes.input} data-color="3" value={colors[3]}/>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.card} style={style.color2}>
              <div>
                <Typography align="left" type="subheading">page</Typography>
                <Divider/>
              </div>
              <div>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>column</span>
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={column === 1}
                          onChange={this.changeColumn}
                          classes={{
                            checked: classes.checked,
                          }}
                        />
                      }
                      label="Use one column"
                      title="You need to refresh the page."
                    />
                  </div>
                </div>
                <div className={classes.controlBox} onChange={this.handleOtherChange}>
                  <span className={classes.caption}>gutter</span>
                  <div>
                    <input className={classes.input} name="gutter" value={gutter} onBlur={this.changeGutter}/>
                  </div>
                </div>
                <div className={classes.controlBox} onChange={this.handleOtherChange}>
                  <span className={classes.caption}>padding</span>
                  <div>
                    <input className={classes.input} name="padding" value={padding} onBlur={this.changePadding}/>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.card} style={style.color3}>
              <div>
                <Typography align="left" type="subheading">font</Typography>
                <Divider/>
              </div>
              <div onBlur={this.changeFontConfig} onChange={this.handleOtherChange}>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>font size</span>
                  <div title="Valid range: 10-100">
                    <input className={classes.input} name="fontSize" value={fontSize === 0 ? 'default' : fontSize}/>
                  </div>
                </div>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>line height</span>
                  <div title="Valid range: 1-100">
                    <input className={classes.input} name="lineHeight" value={lineHeight === 0 ? 'default' : lineHeight}/>
                  </div>
                </div>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>letter spacing</span>
                  <div title="Valid range: 0-100">
                    <input className={classes.input} name="letterSpacing" value={letterSpacing === 0 ? 'default' : letterSpacing}/>
                  </div>
                </div>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>word spacing</span>
                  <div title="Valid range: 0-100">
                    <input className={classes.input} name="wordSpacing" value={wordSpacing === 0 ? 'default' : wordSpacing}/>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.card} style={style.color0}>
              <div>
                <Typography align="left" type="subheading">style</Typography>
                <Divider/>
              </div>
              <div className={classes.box}>
                <label htmlFor="custom-style">
                  <Tooltip placement="bottom" title="import custom stylesheet">
                    <StyleIcon className={classes.icon}/>
                  </Tooltip>
                  <input type="file" accept="text/css" id="custom-style" className={classes.hide} onChange={this.changeUserStyle}/>
                </label>
                <Tooltip placement="bottom" title="reset">
                  <ResetIcon className={classes.icon} onClick={this.resetUserStyle} style={{marginLeft: 60}}/>
                </Tooltip>
              </div>
            </div>
            <div className={classes.card} style={style.color1}>
              <div>
                <Typography align="left" type="subheading">other</Typography>
                <Divider/>
              </div>
              <div>
                <div className={classes.controlBox}>
                  <span className={classes.caption}>popup</span>
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={disablePopup}
                          onChange={this.disablePopup}
                          classes={{
                            checked: classes.checked,
                          }}
                        />
                      }
                      label="Disable popup menu"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions color="primary">
            <Button onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingsDialog);
