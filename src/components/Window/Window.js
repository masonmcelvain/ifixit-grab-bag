import React, { useState, useEffect } from 'react';
import './Window.css';

import GearBagDropArea from '../GearBag/GearBagDropArea';
import MyItemCard from '../MyItemCard/MyItemCard';
import GearGridDropArea from '../GearGrid/GearGridDropArea';

export default function Window() {

  let [hierarchy, setHierarchy] = useState(null);
  let [displayTitles, setDisplayTitles] = useState(null);
  // use updateMyWikisAndStorage(), not setMyItemWikis, to maintain localStorage
  let [myItemWikis, setMyItemWikis] = useState([]);
  let [myWikiKeys, setMyWikiKeys] = useState([]);

  const localStorage = window.localStorage;
  const STORAGE_PREFIX = "grab-bag-wiki-index";

  /**
   * ComponentDidMount -> check if any wikis exist in localStorage
   * 
   * Order the wikis to match how they were during the last session, and
   * add them to the gear bag.
  */
  useEffect(() => {
    let storedWikis = [];
    let storedWikiKeys = [];
    let orderedLocalStorage = {};

    // Sort the stored gear items by key
    for (const k of Object.keys(localStorage).sort()) {
      orderedLocalStorage[k] = localStorage[k];
    }

    // Put the gear items in the users bag
    for (const [k, v] of Object.entries(orderedLocalStorage)) {
      if (k.includes(STORAGE_PREFIX)) {
        storedWikis.push(JSON.parse(v));
        storedWikiKeys.push(JSON.parse(v).wikiid);
      }
    }

    setMyItemWikis(storedWikis);
    setMyWikiKeys(storedWikiKeys);
  }, [localStorage]);

  /** Call this whenever updating wikis to update localStorage too */
  let updateMyWikisAndStorage = (newWikis, newWikiKeys) => {
    // Remove ALL stale gear items in storage
    for (const k of Object.keys(localStorage)) {
      if (k.includes(STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    }

    // Add updated wikis to storage based on index position
    for (const wiki of newWikis) {
      let wikiStorageKey = getWikiStorageKey(wiki, newWikis);
      localStorage.setItem(wikiStorageKey, JSON.stringify(wiki));
    }

    setMyItemWikis(newWikis);
    setMyWikiKeys(newWikiKeys);
  };

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
      updateMyWikisAndStorage(updatedMyWikis, updatedMyWikiKeys);
    }
  };

  /** Remove a wiki and its key from the gear bag, if it exists. */
  let removeItemFromBag = (wiki) => {
    let updatedMyWikis = [...myItemWikis];
    let updatedMyWikiKeys = [...myWikiKeys];

    let i = updatedMyWikiKeys.indexOf(wiki.wikiid);
    if (i !== -1) {
      updatedMyWikis.splice(i, 1);
      updatedMyWikiKeys.splice(i, 1);
      updateMyWikisAndStorage(updatedMyWikis, updatedMyWikiKeys);
    }
  };

  /**
   * Generates a key value for storing the wiki in localStorage based on the
   * index position of each wiki in the user's gear bag. Prepends integer 
   * indeces with 0's so that they are sorted correctly as strings.
  */
  let getWikiStorageKey = (wiki, currentWikis) => {
    const MAX_NUM_ZEROS_TO_PREPEND = 100;
    let strIndexOfWiki = currentWikis.indexOf(wiki).toString();

    // Prepend the numeric index of the wiki with zeros
    let numZerosToPrepend = MAX_NUM_ZEROS_TO_PREPEND - strIndexOfWiki.length;
    let prependum = "";
    for (let i = 0; i < numZerosToPrepend; i++) {
      prependum = prependum.concat("0");
    }
    strIndexOfWiki = prependum.concat(strIndexOfWiki);
    
    return STORAGE_PREFIX.concat(strIndexOfWiki);
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
            return w === null ? null : <MyItemCard key={w.wikiid} wiki={w} />;
          })
        }
      </GearBagDropArea>
    </div>
  );
}