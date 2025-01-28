import React from "react";
import parse from "html-react-parser";

const ImageBlock = ({
  file,
  caption,
  withBorder,
  withBackground,
  stretched,
}) => {
  const imageStyle = {
    width: stretched ? "100%" : "auto",
    border: withBorder ? "5px solid #ddd" : "none",
    background: withBackground ? "#f0f0f0" : "none",
  };

  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-sm pt-3">
      <img src={file.url} alt={caption} style={imageStyle} />
      {caption && <p className="font-bold text-md md:text-lg">{parse(caption)}</p>}
      {/* Use html-react-parser to parse the caption content */}
    </div>
  );
};

export default ImageBlock;
