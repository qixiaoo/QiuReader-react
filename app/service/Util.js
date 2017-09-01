// 工具类
class Util {
  // 获取元素的样式
  static getStyle(element, attr) {
    if (element.currentStyle) {
      return element.currentStyle[attr];
    } else {
      return getComputedStyle(element)[attr];
    }
  }
}

export default Util;
