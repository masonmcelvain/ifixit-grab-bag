import React from 'react';
import GearGrid from './GearGrid';
import './GearGrid.css';

import { ItemTypes } from '../../Constants';
import { useDrop } from 'react-dnd';

export default function GearGridDropArea({ hierarchy, displayTitles, addItemToBag, removeItemFromBag }) {

  const [{ isOver, droppedItem }, drop] = useDrop({
    accept: ItemTypes.MYITEM,
    drop: () => removeItemFromBag(droppedItem["wiki"]),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      droppedItem: monitor.getItem(),
    }),
  });

  let isOverStyle = isOver ? { backgroundColor: "rgba(51, 51, 51, 0.2)" } : null;

  return (
    <div
      ref={drop}
      className="GearGridDropArea"
      style={isOverStyle}
    >
      <GearGrid 
        hierarchy={hierarchy}
        displayTitles={displayTitles}
        addItemToBag={addItemToBag}
      />
    </div>
  );
}