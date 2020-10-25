import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="Loader">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
}