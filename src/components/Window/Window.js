import React, { useState, useEffect } from 'react';
import './Window.css';

import MyItemCard from '../MyItemCard/MyItemCard';
import MyItemCardDropArea from '../MyItemCard/MyItemCardDropArea';
import GearBagDropArea from '../GearBag/GearBagDropArea';
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

    let i = myWikiKeys.indexOf(wiki.wikiid);
    if (i !== -1) {
      updatedMyWikis.splice(i, 1);
      updatedMyWikiKeys.splice(i, 1);
      updateMyWikisAndStorage(updatedMyWikis, updatedMyWikiKeys);
    }
  };

  /**
   * Reorder the items in the gear bag by putting the given wiki at the given 
   * index
   */
  let moveMyItem = (wiki, newIndex) => {
    let updatedMyWikis = [...myItemWikis];
    let updatedMyWikiKeys = [...myWikiKeys];

    let oldIndex = myWikiKeys.indexOf(wiki.wikiid);
    // If item was found and is being moved to a new spot...
    if (oldIndex !== -1 && newIndex !== oldIndex) {
      // If item is being moved to a lower index...
      if (newIndex < oldIndex) {
        // ...remove the item at oldIndex + 1 because list was lengthened
        updatedMyWikis.splice(newIndex, 0, wiki);
        updatedMyWikiKeys.splice(newIndex, 0, wiki.wikiid);
        updatedMyWikis.splice(oldIndex + 1, 1);
        updatedMyWikiKeys.splice(oldIndex + 1, 1);
      }
      // ...else if item is being moved to a higher index...
      else if (newIndex > oldIndex) {
        // ...put the item at newIndex + 1 so as to not lengthen the list
        updatedMyWikis.splice(newIndex + 1, 0, wiki);
        updatedMyWikiKeys.splice(newIndex + 1, 0, wiki.wikiid);
        updatedMyWikis.splice(oldIndex, 1);
        updatedMyWikiKeys.splice(oldIndex , 1);
      }
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

  let renderMyItemCards = () => {
    let cardsToDisplay = myItemWikis.map(w => {
      return w === null ?
        null : 
        <MyItemCardDropArea
          key={w.wikiid}
          indexOfThisWiki={myItemWikis.indexOf(w)}
          moveMyItem={moveMyItem}
          isEmptySpace={false}
        >
          <MyItemCard key={w.wikiid} wiki={w} />
        </MyItemCardDropArea>;
    });
    
    // Display an empty drop area to make it easier to put items at the end
    if (cardsToDisplay.length > 0) {
      cardsToDisplay.push(
        <MyItemCardDropArea
          key={"lastWikiPlaceholder"}
          indexOfThisWiki={myItemWikis.length - 1}
          moveMyItem={moveMyItem}
          isEmptySpace={true}
        />
      );
    }
    return cardsToDisplay;
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
        { renderMyItemCards() }
      </GearBagDropArea>
    </div>
  );
}