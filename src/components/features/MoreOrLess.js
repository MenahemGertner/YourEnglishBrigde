import React, {useState } from "react"

const MoreOrLess = ({ items, itemRenderer, maxItems = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? items : items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <div className="flex flex-col">
      {displayedItems.map(itemRenderer)}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-900 hover:text-blue-600 text-sm px-2 mt-2 text-left "
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
};

export default MoreOrLess;