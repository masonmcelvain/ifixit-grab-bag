import React, { useEffect, useState } from 'react';
import './GearGrid.css';

import ItemCard from '../ItemCard/ItemCard';
import PageNav from '../PageNav/PageNav';
import Loader from '../Loader/Loader';

export default function GearGrid({ hierarchy, displayTitles }) {

  /**
   * nodePath: [str, str, ...] 
   * Array of string titles, in order from root, leading to the current 
   * hierarchical node selected 
   */
  let [nodePath, setNodePath] = useState([]);
  let [availableTitles, setAvailableTitles] = useState([]);
  let [wikis, setWikis] = useState([]);
  let [curPage, setCurPage] = useState(0);
  let [maxPage, setMaxPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

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

  /** Returns 0-indexed page number */
  let getMaxPage = (newTitles) => {
    return Math.floor(newTitles.length / ITEMS_PER_PAGE);
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
      setCurPage(0);

      let newTitles = getTitleChildren(title);
      setMaxPage(getMaxPage(newTitles));
      fetchPageContent(newTitles, 0);
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

  let changePage = (newPageNum) => {
    setCurPage(newPageNum);
    fetchPageContent(availableTitles, newPageNum);
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
  let fetchPageContent = async (titles, pageNum) => {
    let newWikis = [];
    let nextTitleIndex = pageNum * ITEMS_PER_PAGE;
    let stopIndex = Math.min(nextTitleIndex + ITEMS_PER_PAGE, titles.length);

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

  /** Initial population of wikis */
  useEffect(() => {
    if (hierarchy) {
      let initialTitles = Object.keys(hierarchy);
      setAvailableTitles(initialTitles);
      setMaxPage(getMaxPage(initialTitles));
      fetchPageContent(initialTitles, curPage);
    }
  }, [hierarchy]);

  /** Show loading page whenever wikis are not up to date */
  const isLoading = wikis.length === 0 ||
    availableTitles[curPage * ITEMS_PER_PAGE] !== wikis[0].title;

  return (
    <div className="GearGrid">
      <div className="GearGrid-card-container">
        {
          isLoading ?
          <Loader /> :
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
      <PageNav 
        curPage={curPage} 
        maxPage={maxPage} 
        changePage={changePage}
      />
    </div>
  );
}