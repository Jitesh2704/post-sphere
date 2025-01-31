import React, { useState, useEffect } from "react";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArticlesPublished from "../../components/My Postings/ArticlesPublished";
import DraftArticles from "../../components/My Postings/DraftArticles";
import PostsService from "../../services/post-service/posts.service";
import { useSelector } from "react-redux";
import PostForm from "./PostForm";
import Typer from "../../components/My Postings/templates/Typer";

const YourPosts = () => {
  const menus = ["Published Posts", "Drafted Posts"];
  const [activeMenu, setActiveMenu] = useState("Published Posts");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const articlesPerPage = 4;
  const { user } = useSelector((state) => state.auth);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await PostsService.getAllPosts(
        currentPage,
        articlesPerPage,
        [],
        {
          is_draft: activeMenu === "Published Posts" ? false : true,
          created_by: user.user_id,
        }
      );
      setPosts(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentPage, articlesPerPage, activeMenu, user]);

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

  const handleTabClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };

  const handleEdit = (postId) => {
    setSelectedPostId(postId);
    setEditModal(true);
  };

  const closeOnClick = () => {
    setEditModal(false);
    setSelectedPostId(null);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center">
        <Typer />
      </div>
    );
  }

  return (
    <div className="w-full pr-3 relative">
      <button
        className="absolute right-6 top-0 px-4 py-2 bg-blue-600 text-white rounded-full hover:shadow-2xl hover:border hover:border-white whitespace-nowrap"
        onClick={handleOpenCreateModal}
      >
        <FontAwesomeIcon icon={faPenSquare} className="mr-1" /> Start Writing
      </button>
      <div className="mb-2 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {menus.map((menu, index) => (
            <li key={index} className="me-2">
              <button
                onClick={() => handleTabClick(menu)}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-all ${
                  activeMenu === menu
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                <svg
                  className={`w-4 h-4 me-2 ${
                    activeMenu === menu
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox={
                    menu === "Published Posts" ? "0 0 18 18" : "0 0 18 20"
                  }
                >
                  {menu === "Published Posts" ? (
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  ) : (
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  )}
                </svg>
                {menu}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {posts.length === 0 && !loading ? (
        <div className="flex flex-col justify-center items-center h-[60vh]">
          {activeMenu === "Published Posts"
            ? "You haven't Published any Posts yet. Start creating a post today!"
            : "You don't have any Drafts."}{" "}
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

      <div className="pt-2">
        {activeMenu === menus[1] && (
          <div className="px-0">
            {posts.length > 0 ? (
              <DraftArticles
                data={posts}
                fetchUserPosts={fetchUserPosts}
                handleEdit={handleEdit}
              />
            ) : null}
          </div>
        )}
        {activeMenu === menus[0] && (
          <div className="px-0">
            {posts.length > 0 ? (
              <ArticlesPublished
                data={posts}
                fetchUserPosts={fetchUserPosts}
                handleEdit={handleEdit}
              />
            ) : null}
          </div>
        )}
      </div>
      {createModal && <PostForm onClose={() => setCreateModal(false)} />}
      {editModal && <PostForm onClose={closeOnClick} postId={selectedPostId} />}
    </div>
  );
};

export default YourPosts;
