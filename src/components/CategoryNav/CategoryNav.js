import React from 'react';
import './CategoryNav.css';

import {ReactComponent as ChevronRight} from '../../assets/chevron-right.svg';

export default function CategoryNav({ nodePath, goToNode }) {
  let path = [...nodePath];
  path.unshift("Home");

  return (
    <div className="CategoryNav">
      {
        path.length > 1 ?
        path.map(nodeName => {
          const endIndex = nodePath.indexOf(nodeName) + 1;
          const shortName = nodeName.slice(0, 16).concat("...");
          return (
            nodeName === path.slice(-1)[0] ?
            <p
              key={nodeName}
              className="CategoryNav-text"
              style={{ cursor: "auto" }}
            >
              {nodeName}
            </p> :
            <div key={nodeName} className="CategoryNav-arrow-box">
              <div className="CategoryNav-text-box"><p
                className="CategoryNav-text"
                onClick={() => goToNode(nodePath.slice(0, endIndex))}
              >
                {nodeName.length > 16 ? shortName : nodeName}
              </p></div>
              <ChevronRight className="CategoryNav-icon" />
            </div>
          );
        })
        :
        null
      }
    </div>
  );
}
