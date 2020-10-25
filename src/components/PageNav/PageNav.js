/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import './PageNav.css';

export default function PageNav({ curPage, maxPage, changePage }) {
  // curPage and maxPage are 0-indexed

  let pageNums = [];
  for (let i = 0; i < maxPage + 1; i++) {
    pageNums.push(i + 1);
  }

  return (
    <div className="PageNav">
      <button 
        className="PageNav-button"
        onClick={() => changePage(curPage - 1)}
        disabled={curPage === 0}
      >
        Back
      </button>
      {
        pageNums.map(n => (
          <div className="PageNav-n-box" onClick={() => changePage(n - 1)}>
            <p
              style={{
                color: n - 1 === curPage ? "var(--ifixit-blue" : "var(--text)",
                fontWeight: n - 1 === curPage ? "bold" : "normal"
              }}
            >
              {n}
            </p>
          </div>
        ))
      }
      <button 
        className="PageNav-button"
        onClick={() => changePage(curPage + 1)}
        disabled={curPage === maxPage}
      >
        Next
      </button>
    </div>
  );
}