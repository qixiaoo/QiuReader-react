// 阅读期间自动记录当前阅读位置
class AutoBookmark {

  static recordCfi(bookKey, cfi) {
    let json = localStorage.getItem('autoBookmark');
    let obj = JSON.parse(json) || {};
    obj[bookKey] = cfi;

    localStorage.setItem('autoBookmark', JSON.stringify(obj));
  }

  static getCfi(bookKey) {
    let json = localStorage.getItem('autoBookmark');
    let obj = JSON.parse(json) || {};

    return obj[bookKey] || null;
  }

  static clear(bookKey) {
    let json = localStorage.getItem('autoBookmark');
    let obj = JSON.parse(json) || {};
    delete obj[bookKey];

    localStorage.setItem('autoBookmark', JSON.stringify(obj));
  }
}

export default AutoBookmark;
