import React from "react";
import ChapterItem from './ChapterItem';

class ChapterList extends React.Component {

  render() {
    const {chapters, collapse, epub} = this.props;

    return (
      <ul className={collapse ? 'chapter-list collapse' : 'chapter-list expand'}>
        {
          chapters.map((chapter, index) => <ChapterItem key={index} chapter={chapter} epub={epub}/>)
        }
      </ul>
    );
  }
}

export default ChapterList;
