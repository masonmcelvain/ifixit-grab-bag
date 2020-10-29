import React from 'react';
import './MyItemCard.css';

import { ItemTypes } from '../../Constants';
import { useDrop } from 'react-dnd';

export default function MyItemCardDropArea(props) {
  let { indexOfThisWiki, moveMyItem, isEmptySpace, children } = props;

  const [{ isOver, droppedItem }, drop] = useDrop({
    accept: ItemTypes.MYITEM,
    drop: () => moveMyItem(droppedItem["wiki"], indexOfThisWiki),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      droppedItem: monitor.getItem(),
    }),
  });

  let isOverStyle = (
    isOver ? { backgroundColor: "rgba(51, 51, 51, 0.2)" } : null
  );

  let isEmptySpaceStyle = isEmptySpace ? { flexGrow: 1 } : null;

  return (
    <div
      ref={drop}
      className="MyItemCardDropArea"
      style={isEmptySpaceStyle}
    >
      <div
        className="MyItemCardDropArea-hover-bar"
        style={isOverStyle}
      ></div>
      {children}
    </div>
  );
}