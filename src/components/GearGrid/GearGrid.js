import React, { useEffect, useState } from 'react';
import './GearGrid.css';

import ItemCard from '../ItemCard/ItemCard';

export default function GearGrid({ hierarchy, displayTitles }) {

  /**
   * nodePath: [str, str, ...] 
   * Array of string titles, in order from root, leading to the current 
   * hierarchical node selected 
   */
  let [nodePath, setNodePath] = useState([]);
  let [availableTitles, setAvailableTitles] = useState([]);
  let [wikis, setWikis] = useState([]);
  let [pageNum, setPageNum] = useState(0);
  const ITEMS_PER_PAGE = 12;
  const ITEMS_PER_ROW = 4;
  const NUM_ROWS = 3;

  /** 
   * Returns the hierarchical children of the node indicated by the title as an 
   * array of strings. Returns null on error.
   * @param {string} title 
   */
  let getTitleChildren = (title) => {
    let curNode = hierarchy;

    for (let node of nodePath) {
      curNode = hierarchy[node];
    }

    if (Object.keys(curNode).includes(title)) {
      return Object.values(curNode[title]);
    } else {
      return null;
    }
  };

  /**
   * Takes the user 'down' a level to the node specified.
   * @param {string} title - Name of node traversed by user.
   * @throws {InvalidArgumentException} No matching title found.
   */
  let pushNode = (title) => {
    if (availableTitles.includes(title)) {
      let updatedNodePath = nodePath;
      nodePath.push(title);
      setNodePath(updatedNodePath);

      let newTitles = getTitleChildren(title);
      fetchPageContent(newTitles);
    } else {
      throw new Error("Invalid title to pushNode() in GearGrid.js");
    }
  };

  /**
   * Brings the user 'back up a level' by removing the node last visited.
   */
  let popNode = () => {
    let updatedNodePath = nodePath;
    updatedNodePath.pop();
    setNodePath(updatedNodePath);
  };

  /**
   * Returns an integer indicating which wiki is bigger.
   * @param {Object} w1 - A wiki object.
   * @param {Object} w2  - A (different) wiki object.
   */
  let compareWikis = (w1, w2) => {
    if ( w1.title < w2.title ) {
      return -1;
    }
    if ( w1.title > w2.title ) {
      return 1;
    }
    return 0;
  };

  /** 
   * Fetches new wikis for the given titles, adding them to state.
   * @param {string} newTitles - Array of new titles to fetch data for. 
   */
  let fetchPageContent = async (titles) => {
    let newWikis = [];
    let nextTitleIndex = pageNum * ITEMS_PER_PAGE;
    let stopIndex = Math.min(nextTitleIndex + ITEMS_PER_PAGE, titles.length);
    console.log(`start: ${nextTitleIndex}`)
    console.log(`stop: ${stopIndex}`)
    // Fetch each of the appropriate titles
    for (let i = nextTitleIndex; i < stopIndex; i++) {
      const title = titles[i];
      const wikiURL = `https://www.ifixit.com/api/2.0/wikis/CATEGORY/${title}`;
      await fetch(wikiURL)
        .then(res=>res.json())
        .then(data => newWikis.push(data))
        .catch(e => console.error('Fetch page data error in GearGrid.js:', e));
    }
    
    newWikis.sort(compareWikis);
    setWikis(newWikis);
  };

  /* Initial population of wikis */
  useEffect(() => {
    if (hierarchy) {
      let initialTitles = Object.keys(hierarchy);
      setAvailableTitles(initialTitles);
      fetchPageContent(initialTitles);
    }
  }, [hierarchy]);

  return (
    <div className="GearGrid">
      {
        wikis.map(w => (
          <ItemCard 
            key={w.wikiid.toString()}
            title={w.title}
            imageObj={w.image}
            onSelect={pushNode}
          />
        ))
      }
    </div>
  );
}