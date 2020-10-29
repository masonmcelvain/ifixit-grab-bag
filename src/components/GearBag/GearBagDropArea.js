import React from 'react';
import GearBag from './GearBag';
import './GearBag.css';

import { ItemTypes } from '../../Constants';
import { useDrop } from 'react-dnd';

export default function GearBagDropArea({ children, addItemToBag }) {

  const [{ isOver, droppedItem }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: () => addItemToBag(droppedItem["wiki"]),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      droppedItem: monitor.getItem(),
    }),
  });

  let isOverStyle = isOver ? { backgroundColor: "rgba(51, 51, 51, 0.2)" } : null;

  return (
    <div
      ref={drop}
      className="GearBagDropArea"
      style={isOverStyle}
    >
      <GearBag>
        {children}
      </GearBag>
    </div>
  );
}