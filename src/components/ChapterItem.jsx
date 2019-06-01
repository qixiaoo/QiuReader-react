import React from "react";
import ChapterList from "./ChapterList";

class ChapterItem extends React.Component {

  constructor(props) {
    super(props);

    this.handleJump = this.handleJump.bind(this);
  }

  handleJump(event) {
    let href = event.target.getAttribute('href');
    this.props.epub.goto(href);
    event.preventDefault();
  }

  render() {
    const {chapter, epub} = this.props;
    const subList = chapter.subitems && chapter.subitems.length ?
      <ChapterList chapters={chapter.subitems} collapse={false} epub={epub}/> : null;

    return (
      <li className={'chapter-list-item'}>
        <div className="item-content">
          <i className="item-mark"/>
          <a className="chapter-url" href={chapter.href} onClick={this.handleJump}>{chapter.label}</a>
        </div>
        {subList}
      </li>
    );
  }
}

export default ChapterItem;
