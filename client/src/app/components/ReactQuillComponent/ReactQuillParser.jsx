import { useEffect, useRef } from "react";
import parse from "html-react-parser";
import "react-quill/dist/quill.snow.css";

const QuillParser = ({ content }) => {
  const quillRef = useRef(null);
  console.log({ content });
  useEffect(() => {
    if (quillRef.current) {
      const height = quillRef.current.scrollHeight;
      quillRef.current.style.height = `${height}px`;
    }
  }, [content]);

  return (
    <>
      <div className="relative">
        <div
          className="ql-editor"
          ref={quillRef}
          style={{
            height: "auto",
            minHeight: "1rem",
            padding: "0",
            margin: "0",
            overflow: "hidden",
          }}
        >
          {parse(content)}
        </div>
      </div>
    </>
  );
};

export default QuillParser;
