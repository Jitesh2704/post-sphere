import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import CommonCard from "./CommonCard";

const ArticlesList = ({ data }) => {
  const [showMore, setShowMore] = useState(false);

  const visibleArticles =
    data && data.length > 0 ? (showMore ? data : data.slice(0, 5)) : [];

  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  const handleSeeLessClick = () => {
    setShowMore(false);
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-10 gap-3">
        {visibleArticles?.map((post, index) => (
          <div key={index} className="col-span-2">
            <CommonCard data={post} />
          </div>
        ))}

        {data && data.length > 3 && (
          <div className="col-span-10">
            {showMore ? (
              <button
                className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
                onClick={handleSeeLessClick}
              >
                <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
                See Less
              </button>
            ) : (
              <button
                className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
                onClick={handleSeeMoreClick}
              >
                <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                See More Articles from Author
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
