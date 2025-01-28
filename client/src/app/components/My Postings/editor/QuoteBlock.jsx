import React from "react";
import parse from "html-react-parser";

const QuoteBlock = ({ text, caption, alignment }) => {
  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      default:
        return "";
    }
  };

  return (
    <div
      className={`quote ${getAlignmentClass()} flex flex-col items-center my-8`}
    >
      <blockquote>
        <p className="font-bold text-xl md:text-2xl">
          {parse(`" ${text} "`)}
          
        </p>
        {caption && (
          <cite className="flex justify-center items-center">
            {"- "}
            {parse(caption)}{" "}
          </cite>
        )}
      </blockquote>
    </div>
  );
};

export default QuoteBlock;
