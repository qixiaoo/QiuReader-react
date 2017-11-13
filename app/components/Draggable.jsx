import React from 'react';
import PropTypes from 'prop-types';

class Draggable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO 修改为更为通用的形式
      x: this.props.left ? this.props.left : 0, // 可拖动元素的 left 属性的值
      y: this.props.top ? this.props.top : 0, // 可拖动元素的 top 属性的值
    };

    // 鼠标初始时的位置
    this.startX = 0;
    this.startY = 0;
    // 可拖动元素的初始位置
    this.sourceX = 0;
    this.sourceY = 0;
    this.element = null; // 可拖动的元素

    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
  }

  start(event) {
    [this.sourceX, this.sourceY] = [this.state.x, this.state.y];
    [this.startX, this.startY] = [event.clientX, event.clientY];

    document.addEventListener('mousemove', this.move, false);
    document.addEventListener('mouseup', this.end, false);
  }

  move(event) {
    let [currentX, currentY] = [event.clientX, event.clientY]; // 当前鼠标位置

    // 鼠标移动距离
    let distX = currentX - this.startX;
    let distY = currentY - this.startY;

    // 当前元素位置
    let x = parseInt(this.sourceX + distX);
    let y = parseInt(this.sourceY + distY);

    // 元素可以设置的最大left和最大top（避免移出屏幕）
    let maxEX = window.innerWidth - parseFloat(this.getStyle('width'));
    let maxEY = window.innerHeight - parseFloat(this.getStyle('height'));

    x = x > maxEX ? maxEX : x;
    x = x < 0 ? 0 : x;
    y = y > maxEY ? maxEY : y;
    y = y < 0 ? 0 : y;

    this.setState({x, y});
  }

  end() {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.end);
  }

  getStyle(attr) {
    if (document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(this.element, null)[attr];
    } else {
      return this.element.currentStyle[attr];
    }
  }

  render() {
    let style = {
      position: 'fixed',
      left: this.state.x,
      top: this.state.y,
    };

    return (
      <div style={style} onMouseDown={this.start} ref={(element) => {
        this.element = element
      }}>
        {this.props.children}
      </div>
    );
  }
}

Draggable.propTypes = {
  left: PropTypes.number,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Draggable;
