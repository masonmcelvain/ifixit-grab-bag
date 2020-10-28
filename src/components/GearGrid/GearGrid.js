import React, { useEffect, useState, useCallback } from 'react';
import './GearGrid.css';

import ItemCard from '../ItemCard/ItemCard';
import PageNav from '../PageNav/PageNav';
import Loader from '../Loader/Loader';
import LeafItem from '../LeafItem/LeafItem';
import CategoryNav from '../CategoryNav/CategoryNav';

export default function GearGrid({ hierarchy, displayTitles, addItemToBag }) {

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
  let [isLeafNode, setIsLeafNode] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 12;

  /** 
   * Returns the hierarchical children of the node indicated by the title as an 
   * array of strings. Returns null on error.
   * @param {string} title 
   */
  let getTitlesFromPath = (path) => {
    let curNode = hierarchy;
    for (let node of path) {
      curNode = curNode[node];
    }

    if (curNode != null) {
      return Object.keys(curNode);
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
      updatedNodePath.push(title);
      setNodePath(updatedNodePath);

      let newTitles = getTitlesFromPath(updatedNodePath);
      /* If the node has no children, it is a leaf node */
      if (newTitles === null) {
        setIsLeafNode(true);
        setMaxPage(0);
        setWikis( [ wikis[availableTitles.indexOf(title)] ] );
        setAvailableTitles([]);
      } else {
        setIsLeafNode(false);
        setMaxPage(getMaxPage(newTitles));
        setAvailableTitles(newTitles);
        fetchPageContent(newTitles, 0);
      }
    } else {
      throw new Error("Invalid title to pushNode() in GearGrid.js");
    }
  };

  /**
   * Used by CategoryNav to traverse back to a previous node and update the DOM.
   * The path, in theory, should never lead to a leaf node.
   * 
   * @param {[string, ...]} path - Path down hierarchy to current node.
   */
  let goToNode = (path) => {
    let newTitles = getTitlesFromPath(path);
    setIsLeafNode(false);
    setNodePath(path);
    setMaxPage(getMaxPage(newTitles));
    setAvailableTitles(newTitles);
    fetchPageContent(newTitles, 0);
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
  const fetchPageContent = useCallback(async (titles, pageNum) => {
    setIsLoading(true);
    let newWikis = [];
    let nextTitleIndex = pageNum * ITEMS_PER_PAGE;
    let stopIndex = Math.min(nextTitleIndex + ITEMS_PER_PAGE, titles.length);
    
    // Fetch each of the appropriate titles
    for (let i = nextTitleIndex; i < stopIndex; i++) {
      const title = titles[i];
      const wikiURL = `https://www.ifixit.com/api/2.0/wikis/CATEGORY/${title}`;
      await fetch(wikiURL)
        .then(res => res.json())
        .then(data => newWikis.push(data))
        .catch(e => console.error('Fetch page data error in GearGrid.js:', e));
    }
    
    newWikis.sort(compareWikis);
    setWikis(newWikis);
    setCurPage(pageNum);
    setIsLoading(false);
  }, []);

  /** Initial population of wikis */
  useEffect(() => {
    if (hierarchy) {
      let initialTitles = Object.keys(hierarchy);
      setAvailableTitles(initialTitles);
      setMaxPage(getMaxPage(initialTitles));
      fetchPageContent(initialTitles, 0); // Start on first page
    }
  }, [hierarchy, fetchPageContent]);

  return (
    <div className="GearGrid">
      <CategoryNav
        nodePath={nodePath}
        goToNode={goToNode}
      />
      {
        isLeafNode ?
        <div className="GearGrid-leaf-card-container">
          <LeafItem
            wiki={wikis[0]}
            onSelect={addItemToBag}
          />
        </div>
        :
        <div className="GearGrid-card-container">
          {
            isLoading ?
            <Loader /> :
            wikis.map(w => (
              <ItemCard 
                key={w.wikiid.toString()}
                wiki={w}
                onSelect={pushNode}
              />
            ))
          }
        </div>
      }
      <PageNav 
        curPage={curPage} 
        maxPage={maxPage} 
        changePage={changePage}
      />
    </div>
  );
}