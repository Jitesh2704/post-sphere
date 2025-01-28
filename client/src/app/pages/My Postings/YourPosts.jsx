import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faPenSquare, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArticlesPublished from "../../components/My Postings/ArticlesPublished";
import DraftArticles from "../../components/My Postings/DraftArticles";
import Collections from "../../components/My Postings/Collections";
import PostsService from "../../services/post-service/posts.service";
import { useSelector } from "react-redux";
import UserPostsService from "../../services/post-service/user-posts.service";

const menus = ["Drafts", "Published"];

const YourPosts = () => {
  const [selectedType, setSelectedType] = useState("article");
  const [activeTab, setActiveTab] = useState(menus[0]);
  const [totalPosts, setTotalPosts] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [draftPosts, setDraftPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const navigate = useNavigate();
  const articlesPerPage = 8;
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;

  // Handle write article click function
  const handleWriteArticleClick = () => {
    window.open("/post-details", "_blank");
  };

  const handleTypeChange = (event) => {
    setIsLoaded(false);
    setSelectedType(event.target.value);
    setActiveTab(menus[0]);
    setCurrentPage(1);
  };

  const handleTabClick = (tab) => {
    setIsLoaded(false);
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const fetchUserPosts = async () => {
    try {
      const response = await PostsService.getAllPosts(1, 10, [], {
        created_by: userId,
      });
      console.log("These are fetched posts", response);
      const userPosts = [];
      for (const post of response.data) {
        // Assuming post_id is the property name containing the post ID
        const postId = post.post_id;

        // Fetch details of the post using getAllPosts
        const postDetails = await PostsService.getPost({ post_id: postId });
        userPosts.push(postDetails);
      }
      // console.log(userPosts);
      const filteredPosts = userPosts.filter(
        (post) => post.data.post_type === selectedType
      );

      // console.log("these are filtered posts", filteredPosts);

      const draftIds = filteredPosts
        .filter((post) => post.data.is_draft)
        .map((post) => post.data.post_id);
      const publishedIds = filteredPosts
        .filter((post) => !post.data.is_draft)
        .map((post) => post.data.post_id);

      // console.log("draft ids", draftIds);
      // console.log("published ids", publishedIds);

      const draftDetails = await Promise.all(
        draftIds.map((id) => PostsService.getPost({ post_id: id }))
      );
      const publishedDetails = await Promise.all(
        publishedIds.map((id) => PostsService.getPost({ post_id: id }))
      );

      console.log("draft details", draftDetails);

      setDraftPosts(draftDetails);
      setPublishedPosts(publishedDetails);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
    }
  };

  useEffect(() => {
    fetchUserPosts(selectedType);
  }, [selectedType]);

  const handleNextPage = () => {
    setIsLoaded(false);
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(totalPosts / articlesPerPage))
    );
  };

  const handlePrevPage = () => {
    setIsLoaded(false);
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-14 h-[100vh] overflow-y-auto custom-scrollbar">
      {" "}
      <div className="p-8">
        <div className="grid grid-cols-12 w-full h-full">
          <div className="col-span-12 md:col-span-7 border-r border-gray-300 ">
            <div className="flex flex-row justify-between items-center gap-3 px-2 mb-6 md:mb-10">
              <div className="flex flex-col xl:flex-row justify-start items-start gap-0 md:gap-2 xl:gap-4">
                <div className="font-bold whitespace-nowrap text-3xl font-Poppins mb-4 md:mb-0">
                  {selectedType === "article" && "Articles"}
                  {selectedType === "blog" && "Blogs"}
                  {selectedType === "student-stories" && "Student Story"}
                </div>
                <div className="relative md:mt-2 xl:mt-0">
                  <div className="flex flex-row items-center">
                    <select
                      value={selectedType}
                      onChange={handleTypeChange}
                      className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-xs px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="article">Articles</option>
                      <option value="blog">Blogs</option>
                      <option value="student-stories">Stories</option>
                    </select>
                    <div className="-ml-6 flex items-center pointer-events-none">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-gray-500 text-xs md:text-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mr-6">
                <button
                  className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap mt-12 md:mt-12 lg:mt-8 xl:mt-0 -ml-28 md:-ml-6 xl:-ml-16"
                  onClick={handleWriteArticleClick}
                >
                  <FontAwesomeIcon icon={faPenSquare} />
                  <p>
                    Write a{" "}
                    {selectedType === "student-stories"
                      ? "Story"
                      : selectedType.charAt(0).toUpperCase() +
                        selectedType.slice(1)}
                  </p>
                </button>
              </div>
            </div>
            <div className="flex flex-row md:text-lg">
              {menus.map((menu, index) => (
                <button
                  key={index}
                  onClick={() => handleTabClick(menu)}
                  className={`py-2 md:py-4 w-1/4   ${
                    activeTab === menu ? " border-b-2 border-black" : ""
                  }`}
                >
                  {menu}
                </button>
              ))}
            </div>
            <hr />

            <div className="p-0">
              {activeTab === menus[0] && (
                <div className="px-4">
                  {draftPosts.length > 0 ? (
                    <DraftArticles data={draftPosts} />
                  ) : null}
                </div>
              )}
              {activeTab === menus[1] && (
                <div className="px-4">
                  {publishedPosts.length > 0 ? (
                    <ArticlesPublished data={publishedPosts} />
                  ) : null}
                </div>
              )}
            </div>
            {draftPosts?.length === 0 && publishedPosts?.length === 0 ? (
              <div className="text-center mt-6">
                {activeTab === menus[0]
                  ? "You don't have any drafts."
                  : "You haven't published any posts yet. Start creating a post today!"}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of{" "}
                  {Math.ceil(
                    activeTab === menus[0]
                      ? draftPosts.length / articlesPerPage
                      : publishedPosts.length / articlesPerPage
                  )}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(
                      activeTab === menus[0]
                        ? draftPosts.length / articlesPerPage
                        : publishedPosts.length / articlesPerPage
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-5 px-6 md:pl-4 xl:pl-8 md:pr-6 lg:pr-10 xl:pr-16">
            <Collections userId={userId} />
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default YourPosts;
