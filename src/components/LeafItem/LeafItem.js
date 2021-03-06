import React from 'react';
import './LeafItem.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function LeafItem({ wiki, onSelect }) {
  /* Cut descriptions that are too long (based on character count) */
  const description = wiki.description.length > 175 ?
                      wiki.description.slice(0, 175).concat("...") :
                      wiki.description;

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.ITEM, wiki },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const leafItemCardStyle = {
    transform: 'translate(0, 0)',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div
      ref={drag} 
      /* Prevents parent background from displaying in drag preview (corners) */
      style={leafItemCardStyle}
      className="LeafItem"
      onClick={() => onSelect(wiki)}
    >
      <img
        src={wiki.image["440x330"]}
        alt={wiki.title}
        className="LeafItem-image"
      />
      <h2 className="LeafItem-title">{wiki.title}</h2>
      <p className="LeafItem-desc">{description}</p>
    </div>
  );
}
