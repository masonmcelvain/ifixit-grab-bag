import React, { useState } from 'react';
import './GearBag.css';

import MyItemCard from '../MyItemCard/MyItemCard';

export default function GearBag({ children }) {

  return (
    <div className="GearBag">
      <div className="GearBag-card-container">
        {children}
        <div className="empty-card"></div>
      </div>
      <div className="GearBag-vertical-bar"></div>
    </div>
  );
}