import React from "react";
import parse from "html-react-parser";

const TableBlock = ({ withHeadings, content }) => {
  return (
    <div className="table-container flex justify-center my-10">
      <table className="table">
        <tbody>
          {content.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`${
                    withHeadings && rowIndex === 0 ? "font-bold" : ""
                  } text-sm md:text-md border px-4 py-2`}
                >
                  {parse(cell)}{" "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableBlock;
