import React from "react";
import parse from "html-react-parser";

const ParagraphBlock = ({ text }) => {
  return <p className="text-md md:text-lg pb-3">{parse(text)}</p>;
};

export default ParagraphBlock;
