import React, { useState } from 'react';
import './GearBag.css';

import MyItemCard from '../MyItemCard/MyItemCard';

export default function GearBag({ displayTitles }) {

  let [itemsInBag, setItemsInBag] = useState([]);

  let cards = [<MyItemCard />, <MyItemCard />, <MyItemCard />];

  return (
    <div className="GearBag">
      <div className="GearBag-card-container">
        {cards}
        <div className="empty-card"></div>
      </div>
      <div className="GearBag-vertical-bar"></div>
    </div>
  );
}