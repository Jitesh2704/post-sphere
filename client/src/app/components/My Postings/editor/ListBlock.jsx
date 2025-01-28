import React from "react";
import parse from "html-react-parser";

const ListBlock = ({ type, items }) => {
  const isOrdered = type === "ordered";

  const renderListItem = (item, index) => {
    return <li key={index}>{parse(item)}</li>;
  };

  return (
    <div className="pl-8">
      {isOrdered ? (
        <ol className="list-ordered">
          {items.map((item, index) => renderListItem(item, index))}
        </ol>
      ) : (
        <ul className="list">
          {items.map((item, index) => renderListItem(item, index))}
        </ul>
      )}
    </div>
  );
};

export default ListBlock;
