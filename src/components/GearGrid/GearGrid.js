import React, { useState } from 'react';
import './GearGrid.css';

import ItemCard from '../ItemCard/ItemCard';

export default function GearGrid({ hierarchy, displayTitles }) {

  let [hierarchyLevel, setHierarchyLevel] = useState(null);

  let cards = [<ItemCard />, <ItemCard />, <ItemCard />, <ItemCard />];

  return (
    <div className="GearGrid">
      {cards}
    </div>
  );
}