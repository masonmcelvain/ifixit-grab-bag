import React from 'react';
import './ItemCard.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function ItemCard({ wiki, onSelect }) {

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.ITEM, wiki },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const itemCardStyle = {
    transform: 'translate(0, 0)',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div 
      ref={drag} 
      /* Prevents parent background from displaying in drag preview (corners) */
      style={itemCardStyle}
      className="ItemCard"
      onClick={() => onSelect(wiki.title)}
    >
      <div className="ItemCard-image-container">
        <img
          src={wiki.image.standard}
          alt={wiki.title}
          className="ItemCard-image"
        />
      </div>
      <p className="ItemCard-text">{wiki.title}</p>
    </div>
  );
}