import React, { useState, useEffect } from 'react';
import './Window.css';

import GearBag from '../GearBag/GearBag';
import GearGrid from '../GearGrid/GearGrid';

export default function Window() {

  let [hierarchy, setHierarchy] = useState(null);
  let [displayTitles, setDisplayTitles] = useState(null);

  let fetchCategoryTree = async () => {
    const categoryURL = "https://www.ifixit.com/api/2.0/wikis/CATEGORY?display=hierarchy";

    await fetch(categoryURL)
      .then(res=>res.json())
      .then(data => {
        try {
          setHierarchy(data.hierarchy);
          setDisplayTitles(data.display_titles);
        } catch (e) {
          console.log(`Bad data: ${data}`);
          throw new Error(`Bad category data in fetchCategoryTree() in Window.js: ${e}`);
        }
      })
      .catch(e => console.error('Fetch category tree error in Window.js:', e));
  };
  /* Fetch categories only once on mount */
  useEffect(() => fetchCategoryTree(), []);

  return (
    <div className="Window">
      <GearGrid 
        hierarchy={hierarchy}
        displayTitles={displayTitles}
      />
      <GearBag 
        displayTitles={displayTitles}
      />
    </div>
  );
}