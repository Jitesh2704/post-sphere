import React, { useState } from "react";
import MyPostings from "./MyPostings";
import MyDraft from "./MyDraft";
import Explore from "./Explore";
import YourCollections from "./YourCollections";

export default function Posts() {
  const [activeTab, setActiveTab] = useState("My Posting");

  const handleClick = async (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full bg-neutral-100 flex flex-col justify-center items-center px-3 md:px-6 lg:px-10 py-10 xl:px-20 xl:py-20">
      <div className="text-2xl md:text-4xl xl:text-5xl text-center font-semibold">
        Explore Posting
      </div>
      <div className="text-center w-48 md:w-72 lg:w-96 h-4 bg-blue-400 opacity-90"></div>

      <div className="w-full  flex flex-row flex-wrap justify-center items-center gap-4 md:gap-0 mt-8">
        {["My Posting", "Explore", "My Collections", "My Draft"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleClick(tab)}
            className={`w-1/3 md:w-fit h-8 md:h-12 xl:h-16 px-3 xl:px-6 rounded-md md:rounded-xl text-xs md:text-sm xl:text-xl witespace-nowrap items-center -mt-0.5 mx-1 md:mx-4 md:transition-all md:duration-300 md:transform md:hover:scale-125 ${
              activeTab === tab
                ? "bg-blue-500 text-white scale-125 md:scale-110"
                : "bg-white text-black"
            }`}
          >
            <div className="font-medium">{tab}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 lg:mt-16">
        {activeTab === "My Posting" && <MyPostings />}
        {activeTab === "Explore" && <Explore />}
        {activeTab === "My Collections" && <YourCollections />}
        {activeTab === "My Draft" && <MyDraft />}
      </div>
    </div>
  );
}
