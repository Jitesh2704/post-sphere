import React from "react";
import parse from "html-react-parser";

const Heading = ({ level, text }) => {
  const HeadingTag = `h${level}`;

  return <HeadingTag className="pt-3">{parse(text)}</HeadingTag>;
};

export default Heading;
