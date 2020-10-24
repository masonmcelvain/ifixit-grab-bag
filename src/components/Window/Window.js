import React, { useState, useEffect } from 'react';
import './Window.css';

import GearBag from '../GearBag/GearBag';
import GearGrid from '../GearGrid/GearGrid';

export default function Window() {

  let [hierarchy, setHierarchy] = useState(null);
  let [displayTitles, setDisplayTitles] = useState(null);

  const baseURL = "https://www.ifixit.com/api/2.0";

  let fetchCategoryTree = (baseURL) => {
    const categoryURL = "/wikis/CATEGORY?display=hierarchy";

    fetch(baseURL.concat(categoryURL))
      .then(res=>res.json())
      .then(data => {
        try {
          setHierarchy(data.hierarchy);
          setDisplayTitles(data.display_titles);
        } catch (e) {
          throw `Bad category data in fetchCategoryTree() in Window.js: ${e}`;
        }
      })
      .catch(e => console.error('Fetch category tree error in Window.js:', e));
  };
  /* Fetch categories only once on mount */
  useEffect(() => fetchCategoryTree(baseURL), []);

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