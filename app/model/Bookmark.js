class Bookmark {
  constructor(bookKey, cfi, label) {
    this.key = new Date().getTime() + ''; // 唯一的键
    this.bookKey = bookKey; // 所属的书籍的键
    this.cfi = cfi; // 标记阅读位置的cfi
    this.label = label; // 此项书签的别名
  }
}

export default Bookmark;
