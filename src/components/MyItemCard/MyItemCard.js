import React from 'react';
import './MyItemCard.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function MyItemCard({ wiki }) {
  /* Cut titles that are too long (based on character count) */
  const displayTitle = wiki.title.length > 40 ?
                wiki.title.slice(0, 40).concat("...") :
                wiki.title;

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.MYITEM, wiki },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const myItemCardStyle = {
    transform: 'translate(0, 0)',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div 
      ref={drag} 
      /* Prevents parent background from displaying in drag preview (corners) */
      style={myItemCardStyle}
      className="MyItemCard"
    >
      <img
        src={wiki.image.thumbnail}
        alt={wiki.title}
        className="MyItemCard-image"
      />
      <div className="MyItemCard-h4-box">
        <h4 className="MyItemCard-h4">{displayTitle}</h4>
      </div>
    </div>
  );
}