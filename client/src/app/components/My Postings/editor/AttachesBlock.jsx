import React from "react";
import parse from "html-react-parser";
import pdfImage from "../../../../assets/pdf_image.png";

const AttachesBlock = ({ title, file }) => {
  return (
    <div
      key={file.url}
      className="my-1 md:my-4 mx-3 md:mx-10 p-4 border rounded-lg flex justify-between items-center"
    >
      <div className="flex justify-center items-end">
        <img
          src={pdfImage}
          alt="Attachment"
          className="mr-2 w-10 h-10 rounded-xl"
        />
        <div className="flex flex-col">
          <p className="text-xs md:text-md whitespace-nowrap font-bold">{parse(title)}</p>
          {/* Use html-react-parser to parse the title content */}
          <p className="text-xs md:text-sm">({formatBytes(file.size)})</p>
        </div>
      </div>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-xs md:text-md"
      >
        Download
      </a>
    </div>
  );
};

// Helper function to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default AttachesBlock;
