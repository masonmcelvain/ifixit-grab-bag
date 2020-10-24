import React, { useEffect, useState } from 'react';
import './GearGrid.css';

import ItemCard from '../ItemCard/ItemCard';

export default function GearGrid({ hierarchy, displayTitles }) {

  let [hierarchyLevel, setHierarchyLevel] = useState(1); /* Start @ top level */
  let [titles, setTitles] = useState([]);
  let [imageObjs, setImageObjs] = useState([]);

  let cards = [<ItemCard />, <ItemCard />, <ItemCard />, <ItemCard />];

  let fetchPageContent = async (newTitles) => {
    let newImages = [];

    newTitles.forEach(async title => {
      const wikiURL = `https://www.ifixit.com/api/2.0/wikis/CATEGORY/${title}`;

      await fetch(wikiURL)
        .then(res=>res.json())
        .then(data => {
            try {
              newImages.push(data.image);
            } catch (e) {
              console.log(`Bad data: ${data}`);
              throw `Bad title data in fetchPageContent() in GearGrid.js: ${e}`;
            }
          })
        .catch(e => console.error('Fetch page data error in GearGrid.js:', e));
      
        setImageObjs(newImages);
    });
    
  };
  useEffect(() => {
    if (hierarchy) {
      let initialTitles = Object.keys(hierarchy);
      setTitles(initialTitles);
      fetchPageContent(initialTitles);
    }
  }, [hierarchy]);

  return (
    <div className="GearGrid">
      {cards}
    </div>
  );
}