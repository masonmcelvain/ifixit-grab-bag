import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="Loader">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
  );
}