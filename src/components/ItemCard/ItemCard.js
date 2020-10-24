import React from 'react';
import './ItemCard.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function ItemCard({ title, imageObj, displayTitle, onSelect }) {

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.ITEM },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag} 
      /* Prevents parent background from displaying in drag preview (corners) */
      style={{transform: 'translate(0, 0)'}}
      className="ItemCard"
      onClick={() => onSelect(title)}
    >
      <img src={imageObj.standard} className="ItemCard-image"/>
      <p className="ItemCard-text">{displayTitle}</p>

    </div>
  );
}