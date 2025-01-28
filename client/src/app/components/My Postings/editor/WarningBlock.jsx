import React from "react";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { text } from "@fortawesome/fontawesome-svg-core";

const WarningBlock = ({text}) => {
  // console.log("this is the data: ", text);
  return (
    <div className="flex items-center bg-yellow-200 text-yellow-800 p-3 rounded-md my-3">
      <span className="mr-2">
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </span>
      {/* <p className="text-md md:text-lg">{parse(text?.title)}</p> */}
      <p className="text-md md:text-lg">{parse(text?.message)}</p>
    </div>
  );
};

export default WarningBlock;
