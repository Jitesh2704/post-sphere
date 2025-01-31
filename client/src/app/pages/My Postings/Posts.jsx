import React, { useState, useEffect } from "react";
import PostsService from "../../services/post-service/posts.service";
import { useSelector } from "react-redux";
import Collections from "../../components/My Postings/Collections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer";
import img from "../../../assets/feed.png";
import PostForm from "./PostForm";
import CommonCard from "../../components/My Postings/CommonCard";

const Posts = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { selectedMenu } = useSelector((state) => state.menu);
  const userId = user?.user_id;
  const itemsPerPage = 10;
  const [createModal, setCreateModal] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoaded(false);
      const response = await PostsService.getAllPosts(
        currentPage,
        itemsPerPage,
        [],
        { post_type: selectedMenu },
        inputSearch,
        ["post_name", "post_short_desc", "post_type"],
        "cdate_time",
        "desc"
      );
      console.log("fetched posts", response);
      setTotalPages(response.totalPages);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedMenu, currentPage, inputSearch, itemsPerPage]);

  const handleSearchChange = (value) => {
    setInputSearch(value);
  };

  // Handle next page function
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page function
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-[#131520] pt-14  relative">
      <div className="px-2 pb-10">
        <div className="grid grid-cols-12 w-full h-full ">
          <div className="col-span-12 md:col-span-9 border-r border-gray-600 ">
            <div className="flex flex-row justify-between items-center border-b border-gray-700">
              <div className="flex flex-row items-center">
                <img src={img} className="w-28 object-cover" alt="feed logo" />
                <div className="font-medium text-yellow-600 whitespace-nowrap text-6xl italic">
                  {selectedMenu === "story"
                    ? "Stories"
                    : selectedMenu.charAt(0).toUpperCase() +
                      selectedMenu.slice(1) +
                      "s"}
                </div>
              </div>

              <div className="flex flex-row gap-5 mt-1.5 mr-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Posts"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-96 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                </div>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:shadow-2xl hover:border hover:border-white whitespace-nowrap"
                  onClick={handleOpenCreateModal}
                >
                  <FontAwesomeIcon icon={faPenSquare} className="mr-1" /> Start
                  Writing
                </button>
              </div>
            </div>
            <div className="w-full ">
              {posts.length === 0 && isLoaded ? (
                <div className="flex flex-col justify-center items-center h-[60vh]">
                  No{" "}
                  {selectedMenu === "story"
                    ? "Stories"
                    : selectedMenu.charAt(0).toUpperCase() +
                      selectedMenu.slice(1) +
                      "s"}{" "}
                  Available
                </div>
              ) : posts.length > 0 ? (
                <div class="flex flex-row items-center justify-between px-4 ">
                  <span class="text-sm text-gray-700 dark:text-gray-400">
                    Showing{" "}
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {totalPages}
                    </span>{" "}
                    Pages
                  </span>

                  <div class="inline-flex mt-2 xs:mt-0 gap-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      class="flex items-center justify-center px-4 h-8 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <svg
                        class="w-3.5 h-3.5 me-2 rtl:rotate-180"
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
                          d="M13 5H1m0 0 4 4M1 5l4-4"
                        />
                      </svg>
                      Prev
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      class="flex items-center justify-center px-4 h-8 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      Next
                      <svg
                        class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
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
              ) : (
                <></>
              )}
              {!isLoaded ? (
                <div className="w-full h-[60vh] flex flex-col justify-center items-center">
                  <div class="w-32 h-32 relative flex items-center justify-center">
                    <div class="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl animate-pulse"></div>

                    <div class="w-full h-full relative flex items-center justify-center">
                      <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-spin blur-sm"></div>

                      <div class="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <div class="flex gap-1 items-center">
                          <div class="w-1.5 h-12 bg-cyan-500 rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
                          <div class="w-1.5 h-12 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.1s]"></div>
                          <div class="w-1.5 h-12 bg-indigo-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
                          <div class="w-1.5 h-12 bg-purple-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.3s]"></div>
                        </div>

                        <div class="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
                      </div>
                    </div>

                    <div class="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-100"></div>
                    <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"></div>
                    <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 grid grid-cols-12 gap-3">
                  {posts?.map((post, index) => (
                    <div key={index} className="col-span-3">
                      <CommonCard data={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 pl-4 pr-1 ">
            <Collections userId={userId} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 left-0">
        <Footer />
      </div>

      {createModal && <PostForm onClose={() => setCreateModal(false)} />}
    </div>
  );
};

export default Posts;
