import React from "react";
import parse from "html-react-parser";

const CodeBlock = ({ code }) => {
  return (
    <div className="bg-gray-200 p-2 md:p-4 text-xs md:text-md rounded-md my-3">
      <pre>
        <code>{parse(code)}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
