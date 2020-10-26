import React, { useState, useEffect } from 'react';
import './Window.css';

import GearBagDropArea from '../GearBag/GearBagDropArea';
import GearGrid from '../GearGrid/GearGrid';
import MyItemCard from '../MyItemCard/MyItemCard';
import GearGridDropArea from '../GearGrid/GearGridDropArea';

export default function Window() {

  let [hierarchy, setHierarchy] = useState(null);
  let [displayTitles, setDisplayTitles] = useState(null);
  let [myItemWikis, setMyItemWikis] = useState([]);
  let [myWikiKeys, setMyWikiKeys] = useState([]);

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

  /** Add a wiki and its key to the gear bag, if not a duplicate. */
  let addItemToBag = (wiki) => {
    let updatedMyWikis = [...myItemWikis];
    let updatedMyWikiKeys = [...myWikiKeys];

    /** Duplicate items not permitted in the bag */
    if (!myWikiKeys.includes(wiki.wikiid)) {
      updatedMyWikis.push(wiki);
      updatedMyWikiKeys.push(wiki.wikiid);
      setMyItemWikis(updatedMyWikis);
      setMyWikiKeys(updatedMyWikiKeys);
    }
  };

  /** Remove a wiki and its key from the gear bag, if it exists. */
  let removeItemFromBag = (wiki) => {
    let updatedMyWikis = [...myItemWikis];
    let updatedMyWikiKeys = [...myWikiKeys];

    let i = updatedMyWikiKeys.indexOf(wiki.wikiid);
    if (i != -1) {
      updatedMyWikis.splice(i, 1);
      updatedMyWikiKeys.splice(i, 1);
      setMyItemWikis(updatedMyWikis);
      setMyWikiKeys(updatedMyWikiKeys);
    }
  };
  
  return (
    <div className="Window">
      <GearGridDropArea
        hierarchy={hierarchy}
        displayTitles={displayTitles}
        addItemToBag={addItemToBag}
        removeItemFromBag={removeItemFromBag}
      />
      <GearBagDropArea
        addItemToBag={addItemToBag}
      >
        {
          myItemWikis.map(w => {
            if (w != null) {
              return <MyItemCard key={w.wikiid} wiki={w} />;
            }
          })
        }
      </GearBagDropArea>
    </div>
  );
}