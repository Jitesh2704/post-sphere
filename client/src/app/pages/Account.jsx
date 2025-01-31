import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AccountInfo from "../components/AccountInfo";
import Analytics from "../components/Analytics";
import YourPosts from "./My Postings/YourPosts";

export default function Account() {
  return (
    <div className="min-h-screen w-full relative bg-[#131520]">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>
      <div className="px-10 pt-24 pb-16 grid grid-cols-12 gap-3  ">
        <div className="col-span-9 border-r border-gray-600">
          <YourPosts />
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <AccountInfo />
          <Analytics />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 left-0">
        <Footer />
      </div>
    </div>
  );
}
