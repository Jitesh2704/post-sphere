import React from "react";
import TimeAgo from "./templates/TimeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

export default function CommonCard({ data }) {
  return (
    <div className="w-full rounded-lg shadow-sm bg-gray-800 border-gray-700 h-80 relative">
      <div className="bg-blue-600 w-fit py-0.5 px-3 absolute right-0 top-0 rounded-tr-lg text-white font-medium">
        <FontAwesomeIcon icon={faBookmark} className="mr-1" />{" "}
        {data.post_type.charAt(0).toUpperCase() + data.post_type.slice(1)}
      </div>
      <img
        className="rounded-t-lg object-cover h-32 w-full"
        src={data?.post_img}
        alt=""
      />
      <div className="py-1.5 px-2">
        <div className="text-lg font-semibold tracking-tight text-white line-clamp-2 leading-5">
          {data?.post_name}
        </div>
        <div className="my-1.5 flex flex-row justify-start items-center gap-1.5">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={
                data?.post_author?.img ||
                "https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg"
              }
              alt={
                data?.post_author?.name
                  ? `${data.post_author.name} Profile Image`
                  : "Unknown Profile Image"
              }
            />
          </div>

          <div className="font-semibold text-md whitespace-nowrap">
            {data?.post_author?.name || "Post Author"}
          </div>
        </div>
        <div className="text-xs mb-1.5 tracking-tighter text-justify line-clamp-4 text-gray-300">
          {data?.post_short_desc}
        </div>

        <button
          className="absolute bottom-2 left-2 right-2 inline-flex justify-center items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700 "
          onClick={() => window.open(`/view/${data.post_id}`, "_blank")}
        >
          Checkout Full Post
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
