import React from 'react';
import './MyItemCard.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function MyItemCard({ wiki }) {
  const title = wiki.title;
  const imageObj = wiki.image;

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.MYITEM },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag} 
      /* Prevents parent background from displaying in drag preview (corners) */
      style={{transform: 'translate(0, 0)'}}
      className="MyItemCard"
    >
      <img src={imageObj["thumbnail"]} className="MyItemCard-image" />
      <div className="MyItemCard-h4-box">
        <h4 className="MyItemCard-h4">{title}</h4>
      </div>
    </div>
  );
}