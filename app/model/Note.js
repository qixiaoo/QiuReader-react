class Note {
  constructor(bookKey, chapter, text, cfi, range, color, note) {
    this.key = new Date().getTime() + '';
    this.bookKey = bookKey;
    this.chapter = chapter;
    this.text = text;
    this.cfi = cfi;
    this.range = range; // Rangy.js产生的将Range对象序列化后的字符串
    this.color = color; // 高亮的颜色类型：0, 1, 2, 3
    this.note = note || '';
  }
}

export default Note;
