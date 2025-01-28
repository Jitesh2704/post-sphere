import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faChevronDown,
  faEdit,
  faEllipsisH,
  faSearch,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as solid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as marked } from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faThumbsUp,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import TimeAgo from "../My Postings/templates/TimeAgo";
import PostForm from "../../pages/My Postings/PostForm";
import { getImageUrl } from "../../utils/getUrl";
import PostLikesService from "../../services/post-service/post-likes.service";
import UserCollectionsService from "../../services/post-service/user-collections.service";
import ForumThreadService from "../../services/forum-service/forum-thread.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createNotificationUtil from "../../utils/createNotificationUtil";

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

export default function Explore() {
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
  const articlesPerPage = 10;
  const [showPostForm, setShowPostForm] = useState(false);
  const [clickedPostId, setClickedPostId] = useState(null);
  const [likeStates, setLikeStates] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [markedStates, setMarkedStates] = useState([]);
  const [forumThreadCounts, setForumThreadCounts] = useState({});

  const handleWriteNewClick = () => {
    setShowPostForm(true);
  };

  const closePostForm = () => {
    setShowPostForm(false);
  };

  const handleDropdownToggle = (event, post) => {
    const iconPosition = event.target.getBoundingClientRect();

    setDropdownPosition({
      top: iconPosition.bottom + window.scrollY,
      left: iconPosition.left + window.scrollX,
    });
    setShowDropdown(!showDropdown);
    setClickedPostId(post); // Store the postId of the clicked post
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
        current_user_id,
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

  const handleShareButtonClick = () => {
    // Construct the URL of the post
    const postUrl = `http://localhost:3000/show-post/${clickedPostId.post_id}`;

    // Copy the URL to the clipboard
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        console.log("Link copied to clipboard:", postUrl);
        toast.success("Link copied to clipboard");
        setShowDropdown(false);
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard:", error);
        toast.error("Failed to copy link to clipboard");
      });

    // Close the dropdown
    setShowDropdown(false);
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
        { ...postTypeFilter, is_draft: false },
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

      const initialBookmarkStates = data.map((post) => ({
        markedStates:
          localStorage.getItem(
            `bookmark_${post.post_id}_${current_user_id}`
          ) === "true",
      }));
      setMarkedStates(initialBookmarkStates);

      const initialLikeStates = data.map((post) => ({
        likeStates:
          localStorage.getItem(`like_${post.post_id}_${current_user_id}`) ===
          "true",
      }));
      setLikeStates(initialLikeStates);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  // useEffect to fetch posts
  useEffect(() => {
    fetchPosts().then(() => {
      setIsDataLoaded(true);
    });
  }, [selectedType, currentPage, inputSearch]);

  // Handle type change function
  const handleTypeChange = (post) => {
    setSelectedType(post.target.value);
    setCurrentPage(1); // Reset page number when type changes
  };

  // Handle search change function
  const handleSearchChange = (value) => {
    setInputSearch(value);
  };

  // Define indexOfLastPost and indexOfFirstPost outside of useMemo
  const indexOfLastPost = currentPage * articlesPerPage;
  const indexOfFirstPost = indexOfLastPost - articlesPerPage;

  // Memoize the currentPosts array to avoid unnecessary re-renders
  const currentPosts = useMemo(() => {
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [currentPage, posts, indexOfFirstPost, indexOfLastPost]);

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

  const toggleLike = async (index, post) => {
    try {
      const updatedLikeStates = [...likeStates];
      if (!likeStates[index]?.likeStates) {
        await PostLikesService.createPostLike({
          post_id: post.post_id,
          user_id: current_user_id,
        });
        // Update post like count
        const updatedLikeCount = Math.max(post.like_count + 1, 0);
        const updatedPost = { ...post, like_count: updatedLikeCount };
        await PostsService.updatePost(post.post_id, updatedPost);

        createNotificationUtil(
          post.created_by,
          14,
          [
            {
              username: user.username,
            },
            {
              post_name: post.post_name,
            },
          ],
          "Like Interaction"
        );
        toast.success("You've Liked the post");
        updatedLikeStates[index] = {
          likeStates: true,
        };
        localStorage.setItem(`like_${post.post_id}_${current_user_id}`, true);
      } else {
        const likedPost = await PostLikesService.getPostLike({
          post_id: post.post_id,
          user_id: current_user_id,
        });
        if (likedPost?.data?.is_deleted) {
          updatedLikeStates[index] = {
            likeStates: false,
          };
          localStorage.setItem(
            `like_${post.post_id}_${current_user_id}`,
            false
          );
          return;
        } else {
          await PostLikesService.deletePostLike(likedPost?.data?.post_like_id);
          // Update post like count
          const updatedLikeCount = Math.max(post.like_count - 1, 0);
          const updatedPost = { ...post, like_count: updatedLikeCount };
          await PostsService.updatePost(post.post_id, updatedPost);
          toast.success("You've removed the Like");
          updatedLikeStates[index] = {
            likeStates: false,
          };
          localStorage.setItem(
            `like_${post.post_id}_${current_user_id}`,
            false
          );
        }
      }
      setLikeStates(updatedLikeStates);
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  const toggleBookmark = async (index, post) => {
    try {
      const updatedBookmarkStates = [...markedStates];
      if (!markedStates[index]?.markedStates) {
        await UserCollectionsService.createUserCollection({
          post_id: post.post_id,
          user_id: current_user_id,
        });
        createNotificationUtil(
          current_user_id,
          12,
          [
            {
              username: user.username,
            },
            {
              post_name: post.post_name,
            },
          ],
          "Creation"
        );
        toast.success("Post added to Collections");
        updatedBookmarkStates[index] = {
          markedStates: true,
        };
        localStorage.setItem(
          `bookmark_${post.post_id}_${current_user_id}`,
          true
        );
      } else {
        const collection = await UserCollectionsService.getUserCollection({
          post_id: post.post_id,
          user_id: current_user_id,
        });
        if (collection?.data?.is_deleted) {
          updatedBookmarkStates[index] = {
            markedStates: false,
          };
          localStorage.setItem(
            `bookmark_${post.post_id}_${current_user_id}`,
            false
          );
          return;
        } else {
          await UserCollectionsService.deleteUserCollection(
            collection?.data?.collection_id
          );
          createNotificationUtil(
            current_user_id,
            13,
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
          toast.success("Post removed from Collections");
          updatedBookmarkStates[index] = {
            markedStates: false,
          };
          localStorage.setItem(
            `bookmark_${post.post_id}_${current_user_id}`,
            false
          );
        }
      }
      setMarkedStates(updatedBookmarkStates);
      fetchPosts();
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
    }
  };

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
              Explore Posts
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-4 md:mx-4 xl:mx-0 w-full rounded-xl md:rounded-full h-10 lg:h-12 mt-2 bg-white border border-gray-400 flex items-center">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-xl font-semibold ml-4 "
              />
              <input
                className="rounded-xl w-40 md:rounded-full p-2 ml-2 h-8 lg:h-10 focus:outline-none"
                type="text"
                placeholder="Search Posts..."
                onChange={(e) => handleSearchChange(e.target.value)} // Attach handleSearchChange function
              />
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-3 flex flex-row justify-start items-center mt-1">
              <div className="text-gray-500 text-xs md:text-xl lg:text-xl font-medium mr-2">
                Type:
              </div>
              <div className="flex flex-row items-center mt-1">
                <select
                  name="event_status"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="block appearance-none h-10 w-24 md:w-24 xl:w-44 border-b-4 border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-1 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
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
                className="rounded-full h-10 lg:h-12 bg-blue-600 text-white px-3 xl:px-6 text-xs md:text-lg whitespace-nowrap transition-all duration-300 transform hover:scale-105"
                onClick={handleWriteNewClick}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2 text-lg" />
                Write new
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-3 md:gap-8 xl:gap-10">
            {currentPosts.length === 0 ? (
              <div className="col-span-12 text-center text-md lg:text-xl text-gray-500">
                Currently there are no posts available. <br />
                Don't worry!! Start creating your own posts & Showcase them to{" "}
                <br />
                your fellow peers by clicking the "Write New" button above.
              </div>
            ) : (
              currentPosts.map((post, index) => (
                <div
                  key={index}
                  className="col-span-12 lg:col-span-6 bg-white rounded-3xl"
                >
                  <div className="grid grid-cols-12 h-52 md:h-56 lg:h-full">
                    <div className="col-span-6 w-full h-52 md:h-56 lg:h-full">
                      <img
                        src={
                          post.is_link
                            ? post.post_img
                            : getImageUrl(post.post_img)
                        }
                        alt={`post-${index}`}
                        className="w-full h-52 md:h-56 lg:h-full rounded-l-3xl object-cover"
                      />
                    </div>

                    <div className="p-1.5 md:p-2 lg:p-4 col-span-6 flex flex-col">
                      <div className="flex flex-row justify-between items-end">
                        <div className="text-xs md:text-md font-medium">
                          <TimeAgo date={post.cdate_time.toString()} />
                        </div>
                        {/* <FontAwesomeIcon icon={faBookmark} className="text-md" /> */}
                        <FontAwesomeIcon
                          icon={
                            markedStates[index]?.markedStates
                              ? marked
                              : faBookmark
                          }
                          onClick={() => toggleBookmark(index, post)}
                          className={`mr-3 text-xs md:text-lg xl:text-lg cursor-pointer ${
                            markedStates[index]?.markedStates
                              ? "text-blue-600"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="my-2 w-full flex flex-row justify-start items-start">
                        <img
                          src={post?.post_author?.img}
                          className="w-6 md:w-8 h-6 md:h-8 rounded-full mr-2"
                        />
                        <div className="text-xs md:text-md mt-1 font-semibold">
                          {post?.post_author?.name}
                        </div>
                      </div>
                      <div className="font-semibold text-sm md:text-md lg:text-sm xl:text-xl mt-1 xl:mt-3 line-clamp-2">
                        {post.post_name}
                      </div>
                      <div className="text-xs xl:text-lg line-clamp-2">
                        {post.post_short_desc}
                      </div>
                      <div className="text-xs md:text-md flex flex-row justify-between items-end w-full">
                        <div>
                          <FontAwesomeIcon
                            icon={
                              likeStates[index]?.likeStates ? solid : faThumbsUp
                            }
                            onClick={() => toggleLike(index, post)}
                            className={`mr-3 xl:text-lg cursor-pointer ${
                              likeStates[index]?.likeStates
                                ? "text-blue-500"
                                : ""
                            }`}
                          />
                          <span className="xl:text-lg">{post.like_count}</span>
                        </div>

                        <div>
                          <FontAwesomeIcon
                            icon={faComment}
                            className="mr-3 xl:text-lg"
                          />
                          {/* {post.commentCount} */}
                          <span className="xl:text-lg">
                            {forumThreadCounts[post.post_forum_id] !== undefined
                              ? forumThreadCounts[post.post_forum_id]
                              : 0}
                          </span>
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
                            {clickedPostId.created_by === current_user_id && (
                              <>
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
                              </>
                            )}
                            <button
                              className={dropdownButtonStyle}
                              onClick={handleShareButtonClick}
                            >
                              Share
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
              ))
            )}
            <div className="col-span-12 flex flex-row">
              <div className="w-24 px-4 py-1.5 rounded-full flex flex-row h-10 bg-blue-600 text-white text-xl">
                <FontAwesomeIcon
                  onClick={handlePrevPage}
                  icon={faArrowLeftLong}
                  className={`mt-1 cursor-pointer ${
                    currentPage === 1 ? "text-blue-500 pointer-events-none" : ""
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
        </>
      )}
    </div>
  );
}

// useEffect(() => {
//   const fetchLikeStatus = async () => {
//     try {
//       const updatedLikeStates = await Promise.all(
//         currentPosts.map(async (post) => {
//           try {
//             const likeExists = await PostLikesService.getPostLike({
//               post_id: post.post_id,
//               user_id: current_user_id,
//             });
//             return {
//               post_id: post.post_id,
//               isLiked: likeExists.data ? true : false,
//             };
//           } catch (likeError) {
//             if (likeError.response && likeError.response.status === 404) {
//               return {
//                 post_id: post.post_id,
//                 isLiked: false,
//               };
//             } else {
//               throw likeError;
//             }
//           }
//         })
//       );
//       setLikeStates(updatedLikeStates);
//     } catch (error) {
//       console.error("Error fetching like status:", error.message);
//     }
//   };

//   if (isDataLoaded && currentPosts.length > 0) {
//     fetchLikeStatus();
//   }
// }, [currentPosts, isDataLoaded, current_user_id]);

// const toggleLike = async (index, post) => {
//   try {
//     const likeExists = await PostLikesService.getPostLike({
//       post_id: post.post_id,
//       user_id: current_user_id,
//     });

//     const updatedLikeStates = [...likeStates];

//     if (!likeExists) {
//       // If like does not exist, create a new like
//       await PostLikesService.createPostLike({
//         post_id: post.post_id,
//         user_id: current_user_id,
//       });

// // Update post like count
// const updatedLikeCount = Math.max(post.like_count + 1, 0);
// const updatedPost = { ...post, like_count: updatedLikeCount };
// await PostsService.updatePost(post.post_id, updatedPost);

//       // Update the like state for the current post
//       updatedLikeStates[index] = {
//         post_id: post.post_id,
//         isLiked: true,
//       };
//       setLikeStates(updatedLikeStates);
// createNotificationUtil(
//   post.created_by,
//   14,
//   [
//     {
//       username: user.username,
//     },
//     {
//       post_name: post.post_name,
//     },
//   ],
//   "Creation"
// );
// toast.success("You've Liked the post");
//       fetchPosts();
//     } else {
//       // If like exists, delete the like
//       await PostLikesService.deletePostLike(post.post_id);

// // Update post like count
// const updatedLikeCount = Math.max(post.like_count - 1, 0);
// const updatedPost = { ...post, like_count: updatedLikeCount };
// await PostsService.updatePost(post.post_id, updatedPost);

//       // Update the like state for the current post
//       updatedLikeStates[index] = {
//         post_id: post.post_id,
//         isLiked: false,
//       };
//       setLikeStates(updatedLikeStates);
//       fetchPosts();
//     }

//     //   setLikeStates(updatedLikeStates);
//     //   fetchPosts();
//     console.log(likeStates);
//   } catch (error) {
//     // Revert the like state back if there's an error
//     const revertedLikeStates = [...likeStates];
//     revertedLikeStates[index] = {
//       post_id: post.post_id,
//       isLiked: !likeStates[index]?.isLiked, // Toggle back the like status
//     };
//     setLikeStates(revertedLikeStates);

//     // Check if error is due to 404 (like not found)
//     if (error.response && error.response.status === 404) {
//       // If like doesn't exist, create a new like
//       try {
//         const updatedLikeStates = [...likeStates];
//         await PostLikesService.createPostLike({
//           post_id: post.post_id,
//           user_id: current_user_id,
//         });

//         // Update post like count
//         const updatedLikeCount = Math.max(post.like_count + 1, 0);
//         const updatedPost = { ...post, like_count: updatedLikeCount };
//         await PostsService.updatePost(post.post_id, updatedPost);

//         updatedLikeStates[index] = {
//           post_id: post.post_id,
//           isLiked: true,
//         };

//         setLikeStates(updatedLikeStates);
//         createNotificationUtil(
//           post.created_by,
//           14,
//           [
//             {
//               username: user.username,
//             },
//             {
//               post_name: post.post_name,
//             },
//           ],
//           "Creation"
//         );
//         toast.success("You've Liked the post");
//         fetchPosts();
//       } catch (createError) {
//         console.error("Error creating like:", createError.message);
//       }
//     } else {
//       console.error("Error toggling like:", error.message);
//     }
//   }
// };

//   const toggleLike = async (index, post) => {
//     try {

//       const likeExists = await PostLikesService.getPostLike({
//         post_id: post.post_id,
//         user_id: current_user_id,
//       });

//        const updatedLikeStates = [...likeStates];

//       if (!likeExists) {
//         // If like does not exist, create a new like
//         await PostLikesService.createPostLike({
//           post_id: post.post_id,
//           user_id: current_user_id,
//         });

//         // Update post like count
//         const updatedLikeCount = Math.max(post.like_count + 1, 0);
//         const updatedPost = { ...post, like_count: updatedLikeCount };
//         await PostsService.updatePost(post.post_id, updatedPost);

//         // Update the like state for the current post
//         updatedLikeStates[index] = {
//           post_id: post.post_id,
//           isLiked: true,
//         };
//       } else {
//         // If like exists, delete the like
//         await PostLikesService.deletePostLike(post.post_id);

//         // Update post like count
//         const updatedLikeCount = Math.max(post.like_count - 1, 0);
//         const updatedPost = { ...post, like_count: updatedLikeCount };
//         await PostsService.updatePost(post.post_id, updatedPost);

//         // Update the like state for the current post
//         updatedLikeStates[index] = {
//           post_id: post.post_id,
//           isLiked: false,
//         };
//       }

//       setLikeStates(updatedLikeStates);
//         fetchPosts();
//     } catch (error) {
//       // Check if error is due to 404 (like not found)
//       if (error.response && error.response.status === 404) {
//         // If like doesn't exist, create a new like
//         try {
//           const updatedLikeStates = [...likeStates]; // Define updatedLikeStates here
//           await PostLikesService.createPostLike({
//             post_id: post.post_id,
//             user_id: current_user_id,
//           });

//           // Update post like count
//           const updatedLikeCount = Math.max(post.like_count + 1, 0);
//           const updatedPost = { ...post, like_count: updatedLikeCount };
//           await PostsService.updatePost(post.post_id, updatedPost);

//           updatedLikeStates[index] = {
//             post_id: post.post_id,
//             isLiked: true,
//           };

//           setLikeStates(updatedLikeStates);
//             fetchPosts();
//         } catch (createError) {
//           console.error("Error creating like:", createError.message);
//         }
//       } else {
//         console.error("Error toggling like:", error.message);
//       }
//     }
//   };
