import React from 'react';
import './LeafItem.css';

import { ItemTypes } from '../../Constants';
import { useDrag } from 'react-dnd';

export default function LeafItem({ wiki, onSelect }) {
  const title = wiki.title;
  const imageObj = wiki.image;
  /* Cut descriptions that are too long (based on character count) */
  const description = wiki.description.length > 175 ?
                      wiki.description.slice(0, 175).concat("...") :
                      wiki.description;

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
      className="LeafItem"
      onClick={() => onSelect(title)}
    >
      <img src={imageObj["440x330"]} className="LeafItem-image"/>
      <h2 className="LeafItem-title">{title}</h2>
      <p className="LeafItem-desc">{description}</p>
    </div>
  );
}
