import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Posts from "./My Postings/Posts";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>

      <Posts />
    </div>
  );
}
