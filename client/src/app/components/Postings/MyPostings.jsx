import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faChevronDown,
  faEdit,
  faEllipsisH,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import TimeAgo from "../My Postings/templates/TimeAgo";
import PostForm from "../../pages/My Postings/PostForm";
import { getImageUrl } from "../../utils/getUrl";
import ForumThreadService from "../../services/forum-service/forum-thread.service";
import createNotificationUtil from "../../utils/createNotificationUtil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dropdownStyle = {
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  border: "1px solid #ccc",
  borderRadius: "4px",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
};
const dropdownButtonStyle =
  "dropdown-button bg-white text-black p-2 hover:bg-blue-500 hover:border-none cursor-pointer transition duration-300";

export default function MyPostings() {
  const [selectedType, setSelectedType] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const articlesPerPage = 10;
  const navigate = useNavigate();
  const [showPostForm, setShowPostForm] = useState(false);
  const [clickedPostId, setClickedPostId] = useState(null);
  const [forumThreadCounts, setForumThreadCounts] = useState({});

  const handleWriteNewClick = () => {
    setShowPostForm(true);
  };

  const closePostForm = () => {
    setShowPostForm(false);
  };

  const handleDropdownToggle = (event, postId) => {
    const iconPosition = event.target.getBoundingClientRect();

    setDropdownPosition({
      top: iconPosition.bottom + window.scrollY,
      left: iconPosition.left + window.scrollX,
    });
    setShowDropdown(!showDropdown);
    setClickedPostId(postId); // Store the postId of the clicked post
  };

  const handleEdit = (postId) => {
    console.log("Edit button clicked", postId);

    window.open(`/edit-form/${postId}`, "_blank"); // Use postId
    setShowDropdown(false);
  };

 const handleDelete = async (post) => {
   console.log("Delete button clicked");
   setShowDropdown(false);
   // console.log(postId);
   try {
     await PostsService.deletePost(post.post_id); // Use postId
     console.log("Post marked as deleted");
     createNotificationUtil(
       userId,
       3,
       [
         {
           username: user.username,
         },
         {
           post_name: post.post_name,
         },
       ],
       "Deletion"
     );
     toast.success("Post deleted successfully");
     fetchPosts();
   } catch (error) {
     console.error("Error marking post as deleted:", error.message);
     // Handle error, show a notification maybe?
   }
 };

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      let postTypeFilter = {};
      if (selectedType !== "all") {
        postTypeFilter = { post_type: selectedType };
      }
      const response = await PostsService.getAllPosts(
        1,
        1000,
        [],
        { ...postTypeFilter, created_by: userId, is_draft: false },
        inputSearch,
        ["post_name", "post_short_desc"],
        "",
        ""
      );
      const data = response.data;
      console.log("these are fetched posts", data);
      setPosts(data);
      setTotalPosts(data.length);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedType, currentPage, inputSearch, userId]);

  const getForumThreadCount = async (forumId) => {
    try {
      const response = await ForumThreadService.getAllForumThreads(
        1,
        1000,
        [],
        { forum_id: forumId },
        "",
        [],
        "",
        ""
      );
      const comments = response.data;
      return comments.length;
    } catch (error) {
      console.error("Error fetching count:", error.message);
      return 0; // or handle error as appropriate
    }
  };

  // Handle type change function
  const handleTypeChange = (post) => {
    setSelectedType(post.target.value);
    setCurrentPage(1); // Reset page number when type changes
  };

  // Handle search change function
  const handleSearchChange = (value) => {
    setInputSearch(value);
  };

  const indexOfLastPost = currentPage * articlesPerPage;
  const indexOfFirstPost = indexOfLastPost - articlesPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle next page function
  const handleNextPage = () => {
    console.log(totalPosts);
    if (currentPage < Math.ceil(totalPosts / articlesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page function
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchForumThreadCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const count = await getForumThreadCount(post.post_forum_id);
          counts[post.post_forum_id] = count;
        } catch (error) {
          console.error("Error fetching count:", error.message);
          counts[post.post_forum_id] = 0; // or handle error as appropriate
        }
      }
      setForumThreadCounts(counts);
    };

    fetchForumThreadCounts();
  }, [posts]);

  return (
    <div>
      {showPostForm ? (
        <PostForm onClose={closePostForm} />
      ) : (
        <>
          <div className="w-full grid grid-cols-12 gap-1 md:gap-5 mb-6 lg:mb-12">
            <div className="col-span-4 md:col-span-3 text-2xl lg:text-3xl xl:text-4xl font-semibold mt-3 whitespace-nowrap">
              My Postings
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-4 md:mx-4 lg:mx-0 w-full rounded-xl md:rounded-full h-10 lg:h-12 mt-2 bg-white border border-gray-400 flex items-center">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-xl font-semibold ml-4"
              />
              <input
                className="rounded-xl md:rounded-full p-2 ml-2 h-8 lg:h-10 focus:outline-none"
                type="text"
                placeholder="Search Posts..."
                onChange={(e) => handleSearchChange(e.target.value)} // Attach handleSearchChange function
              />
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-3 flex flex-row justify-start items-center mt-1">
              <div className="text-gray-500 text-xs md:text-xl lg:text-2xl font-medium mr-2">
                Type:
              </div>
              <div className=" flex flex-row items-center mt-1">
                <select
                  name="event_status"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="block appearance-none h-10 lg:h-12 w-32 md:w-24 xl:w-44 border-b-4 border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-1 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="all">All</option>
                  <option value="article">Articles</option>
                  <option value="blog">Blogs</option>
                  <option value="student-stories">Stories</option>
                  <option value="books">Books</option>
                  <option value="journals">Journals</option>
                </select>
                <div className="-ml-8 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-blue-700 font-bold text-md"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 md:col-span-6 lg:col-span-2 flex flex-row justify-end items-end">
              <button
                className="rounded-full h-10 lg:h-12 bg-blue-600 text-white px-3 md:px-6 text-xs md:text-lg whitespace-nowrap transition-all duration-300 transform hover:scale-105"
                onClick={handleWriteNewClick}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="mr-2 text-xs md:text-lg"
                />
                Write new
              </button>
            </div>
          </div>
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-12 gap-3 md:gap-8 xl:gap-10 ">
              {currentPosts.map((post, index) => (
                <div
                  key={index}
                  className="col-span-12 md:col-span-6 bg-white rounded-3xl"
                >
                  <div className="grid grid-cols-12 h-40 md:h-44 lg:h-full">
                    <div className="col-span-6 w-full h-40 md:h-44 lg:h-full">
                      <img
                        src={
                          post.is_link
                            ? post.post_img
                            : getImageUrl(post.post_img)
                        }
                        alt={`post-${index}`}
                        className="w-full h-40 md:h-44 lg:h-full object-cover rounded-l-3xl"
                      />
                    </div>
                    <div className="p-2 lg:p-4 col-span-6 flex flex-col">
                      <div className="text-xs md:text-md font-medium">
                        created <TimeAgo date={post.cdate_time.toString()} />
                      </div>
                      <div className="font-semibold text-sm lg:text-sm xl:text-xl mt-1 xl:mt-3 line-clamp-3">
                        {post.post_name}
                      </div>
                      <div className="text-xs xl:text-lg line-clamp-2">
                        {post.post_short_desc}
                      </div>
                      <div className="text-xs md:text-md flex flex-row justify-between items-end w-full">
                        <div>
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="mr-3 xl:text-lg"
                          />
                          {post.like_count}
                        </div>
                        <div>
                          <FontAwesomeIcon
                            icon={faComment}
                            className="mr-3 xl:text-lg"
                          />
                          {forumThreadCounts[post.post_forum_id] !== undefined
                            ? forumThreadCounts[post.post_forum_id]
                            : 0}
                        </div>
                        <FontAwesomeIcon
                          icon={faEllipsisH}
                          className="text-lg text-black mt-8  mr-2 xl:text-lg cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDropdownToggle(event, post); // Pass the post_id to handleDropdownToggle
                          }}
                        />
                        {showDropdown && (
                          <div
                            style={{
                              ...dropdownStyle,
                              top: dropdownPosition.top + "px",
                              left: dropdownPosition.left + "px",
                            }}
                          >
                            <button
                              className={dropdownButtonStyle}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(clickedPostId.post_id);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className={dropdownButtonStyle}
                              onClick={() => handleDelete(clickedPostId)}
                            >
                              Delete
                            </button>
                            <button
                              className={dropdownButtonStyle}
                              onClick={() => {
                                window.open(
                                  `/show-post/${clickedPostId.post_id}`,
                                  "_blank"
                                );
                                setShowDropdown(false);
                              }}
                            >
                              View Post
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                //   </div>
              ))}
              <div className="col-span-12 flex flex-row">
                <div className="w-24 px-4 py-1.5 rounded-full flex flex-row h-10 bg-blue-600 text-white text-xl">
                  <FontAwesomeIcon
                    onClick={handlePrevPage}
                    icon={faArrowLeftLong}
                    className={`mt-1 cursor-pointer ${
                      currentPage === 1
                        ? "text-blue-500 pointer-events-none"
                        : ""
                    }`}
                  />
                  <span className="text-xl font-semibold mx-2"> | </span>
                  <FontAwesomeIcon
                    onClick={handleNextPage}
                    disabled={indexOfLastPost >= totalPosts}
                    icon={faArrowRightLong}
                    className={`mt-1 cursor-pointer ${
                      indexOfLastPost >= totalPosts
                        ? "text-blue-500 pointer-events-none"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-12 flex flex-col items-center justify-center">
              <p className="text-lg text-center text-gray-500 my-8">
                You haven't published any posts yet.
                <br /> Start your creative writing today & Share your thoughts
                through posts.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
