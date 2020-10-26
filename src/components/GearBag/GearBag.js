import React, { useState } from 'react';
import './GearBag.css';

export default function GearBag({ children }) {

  return (
    <div className="GearBag">
      {
        children.length > 0 ?
        <div className="GearBag-card-container">
          {children}
        </div>
        :
        <p className="GearBag-p">Add your first device!</p>
      }
      <div className="GearBag-vertical-bar"></div>
    </div>
  );
}