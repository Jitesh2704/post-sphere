import React from "react";
import CoverImg1 from "./CoverImg1.png";
import CoverImg2 from "./CoverImg2.png";

export default function LandingCover() {
  return (
    <div className="w-full bg-blue-100 px-6 lg:px-10 xl:px-20 py-8 md:py-16">
      <div className="grid grid-cols-12 gap-6 md:gap-0">
        <div className="col-span-12 md:col-span-5 flex flex-col">
          <div className="text-xs xl:text-sm uppercase tracking-widest text-blue-600 font-semibold">
            Article and blogs
          </div>

          <div className="mb-3 xl:mb-10 text-2xl lg:text-xl xl:text-3xl font-semibold">
            Unleash Your Voice:{" "}
            <span className="text-blue-600">
              Share Your Story Globally with HPDS Platform
            </span>
          </div>
          <img src={CoverImg1} alt="kid" className="w-full" />
        </div>
        <div className="col-span-12 md:col-span-7 pl-0 md:pl-10">
          <img src={CoverImg2} alt="kid" className="w-full" />
          <div className="text-xs lg:text-sm xl:text-xl pt-10 xl:pt-20">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>
        </div>
      </div>
    </div>
  );
}
