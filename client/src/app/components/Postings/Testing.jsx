import React, { useState, useEffect, useRef } from "react";
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
import {
  faComment,
  faThumbsUp,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import PostLikesService from "../../services/post-service/post-likes.service";

export default function Explore() {
  const [selectedType, setSelectedType] = useState("all");
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const articlesPerPage = 4;
  const [likeStates, setLikeStates] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const currentPostsRef = useRef([]);

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

  // Ensure currentPostsRef.current is updated whenever currentPosts changes
  useEffect(() => {
    currentPostsRef.current = currentPosts;
  }, [currentPosts]);

  useEffect(() => {
    console.log("Current Posts changed:", currentPosts);
    console.log("Is Data Loaded:", isDataLoaded);
    console.log("Current User ID:", current_user_id);

    const fetchLikeStatus = async () => {
      try {
        const updatedLikeStates = await Promise.all(
          currentPosts.map(async (post) => {
            try {
              const likeExists = await PostLikesService.getPostLike({
                post_id: post.post_id,
                user_id: current_user_id,
              });
              return {
                post_id: post.post_id,
                isLiked: likeExists.data ? true : false,
              };
            } catch (likeError) {
              if (likeError.response && likeError.response.status === 404) {
                return {
                  post_id: post.post_id,
                  isLiked: false,
                };
              } else {
                throw likeError;
              }
            }
          })
        );
        setLikeStates(updatedLikeStates);
      } catch (error) {
        console.error("Error fetching like status:", error.message);
      }
    };

    if (isDataLoaded && currentPosts.length > 0) {
      fetchLikeStatus();
    }
  }, [currentPosts, isDataLoaded, current_user_id]);

  const toggleLike = async (index, post) => {
    try {
      const updatedLikeStates = [...likeStates];
      const likeExists = await PostLikesService.getPostLike({
        post_id: post.post_id,
        user_id: current_user_id,
      });

      if (!likeExists) {
        // If like does not exist, create a new like
        await PostLikesService.createPostLike({
          post_id: post.post_id,
          user_id: current_user_id,
        });

        // Update post like count
        const updatedLikeCount = Math.max(post.like_count + 1, 0);
        const updatedPost = { ...post, like_count: updatedLikeCount };
        await PostsService.updatePost(post.post_id, updatedPost);

        updatedLikeStates[index] = {
          post_id: post.post_id,
          isLiked: true,
        };
      } else {
        // If like exists, delete the like
        await PostLikesService.deletePostLike(post.post_id);

        // Update post like count
        const updatedLikeCount = Math.max(post.like_count - 1, 0);
        const updatedPost = { ...post, like_count: updatedLikeCount };
        await PostsService.updatePost(post.post_id, updatedPost);

        updatedLikeStates[index] = {
          post_id: post.post_id,
          isLiked: false,
        };
      }

      setLikeStates(updatedLikeStates);
      fetchPosts();
    } catch (error) {
      // Check if error is due to 404 (like not found)
      if (error.response && error.response.status === 404) {
        // If like doesn't exist, create a new like
        try {
          const updatedLikeStates = [...likeStates]; // Define updatedLikeStates here
          await PostLikesService.createPostLike({
            post_id: post.post_id,
            user_id: current_user_id,
          });

          // Update post like count
          const updatedLikeCount = Math.max(post.like_count + 1, 0);
          const updatedPost = { ...post, like_count: updatedLikeCount };
          await PostsService.updatePost(post.post_id, updatedPost);

          updatedLikeStates[index] = {
            post_id: post.post_id,
            isLiked: true,
          };

          setLikeStates(updatedLikeStates);
          fetchPosts();
        } catch (createError) {
          console.error("Error creating like:", createError.message);
        }
      } else {
        console.error("Error toggling like:", error.message);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 xl:gap-10">
        {currentPosts.map((post, index) => (
          <div key={index} className="col-span-6 bg-white rounded-3xl">
            <div className="grid grid-cols-12">
              <div className="p-4 col-span-6 flex flex-col">
                <div className="text-xs md:text-md flex flex-row justify-between items-end w-full">
                  <div>
                    <FontAwesomeIcon
                      icon={likeStates[index].isLiked ? solid : faThumbsUp}
                      onClick={() => toggleLike(index, post)}
                      className={`mr-3 xl:text-lg cursor-pointer ${
                        likeStates[index].isLiked ? "text-blue-500" : ""
                      }`}
                    />
                    <span className="text-lg">
                      {likeStates[index].likeCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

//   <div>
//                         <FontAwesomeIcon
//                           icon={
//                             likeStates[index] && likeStates[index].isLiked
//                               ? faThumbsDown
//                               : faThumbsUp
//                           }
//                           onClick={() => toggleLike(index, post)}
//                           className={`cursor-pointer ${
//                             likeStates[index] && likeStates[index].isLiked
//                               ? "text-blue-500"
//                               : ""
//                           }`}
//                         />
//                         {likeStates[index] && likeStates[index].likeCount}
//                       </div>


  // const toggleLike = async (index, post) => {
  //   try {
  //     const updatedLikeStates = [...likeStates];
  //     if (!likeStates[index].isLiked) {
  //       // If not liked, create a new like
  //       await PostLikesService.createPostLike({
  //         post_id: post.post_id,
  //         created_by: user_id,
  //       });
  //       updatedLikeStates[index] = {
  //         isLiked: true,
  //         likeCount: likeStates[index].likeCount + 1,
  //       };
  //       localStorage.setItem(`like_${post.post_id}`, true);
  //     } else {
  //       // If liked, delete the like
  //       await PostLikesService.deletePostLike(post.post_id, user_id);
  //       updatedLikeStates[index] = {
  //         isLiked: false,
  //         likeCount: likeStates[index].likeCount - 1,
  //       };
  //       localStorage.setItem(`like_${post.post_id}`, false);
  //     }
  //     setLikeStates(updatedLikeStates);
  //   } catch (error) {
  //     console.error("Error toggling like:", error.message);
  //   }
  // };



//   import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowLeftLong,
//   faArrowRightLong,
//   faChevronDown,
//   faEdit,
//   faEllipsisH,
//   faSearch,
//   faThumbsDown,
// } from "@fortawesome/free-solid-svg-icons";
// import { faThumbsUp as solid } from "@fortawesome/free-solid-svg-icons";
// import {
//   faComment,
//   faThumbsUp,
//   faBookmark,
// } from "@fortawesome/free-regular-svg-icons";
// import { useNavigate } from "react-router-dom";
// import PostsService from "../../services/post-service/posts.service";
// import TimeAgo from "../My Postings/templates/TimeAgo";
// import PostForm from "../../pages/My Postings/PostForm";
// import { getImageUrl } from "../../utils/getUrl";
// import PostLikesService from "../../services/post-service/post-likes.service";

// const dropdownStyle = {
//   position: "absolute",
//   backgroundColor: "white",
//   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   zIndex: 100,
//   display: "flex",
//   flexDirection: "column",
// };
// const dropdownButtonStyle =
//   "dropdown-button bg-white text-black p-2 hover:bg-blue-500 hover:border-none cursor-pointer transition duration-300";

// export default function Explore() {
//   const [selectedType, setSelectedType] = useState("all");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState({
//     top: 0,
//     left: 0,
//   });
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [inputSearch, setInputSearch] = useState("");
//   const articlesPerPage = 4;
//   const [showPostForm, setShowPostForm] = useState(false);
//   const [clickedPostId, setClickedPostId] = useState(null);
//   const [likeStates, setLikeStates] = useState([]);
//   const { user } = useSelector((state) => state.auth);
//   const current_user_id = user?.user_id;

//   const handleWriteNewClick = () => {
//     setShowPostForm(true);
//   };

//   const closePostForm = () => {
//     setShowPostForm(false);
//   };

//   const handleDropdownToggle = (event, postId) => {
//     const iconPosition = event.target.getBoundingClientRect();

//     setDropdownPosition({
//       top: iconPosition.bottom + window.scrollY,
//       left: iconPosition.left + window.scrollX,
//     });
//     setShowDropdown(!showDropdown);
//     setClickedPostId(postId); // Store the postId of the clicked post
//   };

//   const handleEdit = (postId) => {
//     console.log("Edit button clicked", postId);

//     window.open(`/edit-form/${postId}`, "_blank"); // Use postId
//     setShowDropdown(false);
//   };

//   const handleDelete = async (postId) => {
//     console.log("Delete button clicked");
//     setShowDropdown(false);
//     console.log(postId);
//     try {
//       await PostsService.deletePost(postId); // Use postId
//       console.log("Post marked as deleted");
//       // Update UI or take other actions after successful deletion
//       fetchPosts();
//     } catch (error) {
//       console.error("Error marking post as deleted:", error.message);
//       // Handle error, show a notification maybe?
//     }
//   };

//   // Fetch posts function
//   const fetchPosts = async () => {
//     try {
//       let postTypeFilter = {};
//       if (selectedType !== "all") {
//         postTypeFilter = { post_type: selectedType };
//       }
//       const response = await PostsService.getAllPosts(
//         1,
//         1000,
//         [],
//         { ...postTypeFilter, is_draft: false },
//         inputSearch,
//         ["post_name", "post_short_desc"],
//         "",
//         ""
//       );
//       const data = response.data;
//       console.log("these are fetched posts", data);
//       setPosts(data);
//       setTotalPosts(data.length);
//       setIsLoaded(true);

//       // Initialize likeStates based on fetched posts
//       const initialLikeStates = data.map((post) => ({
//         isLiked: localStorage.getItem(`like_${post.post_id}`) === "true",
//         likeCount: post.like_count || 0,
//       }));
//       setLikeStates(initialLikeStates);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedType, currentPage, inputSearch]);

//   // Handle type change function
//   const handleTypeChange = (post) => {
//     setSelectedType(post.target.value);
//     setCurrentPage(1); // Reset page number when type changes
//   };

//   // Handle search change function
//   const handleSearchChange = (value) => {
//     setInputSearch(value);
//   };

//   const indexOfLastPost = currentPage * articlesPerPage;
//   const indexOfFirstPost = indexOfLastPost - articlesPerPage;
//   const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

//   // Handle next page function
//   const handleNextPage = () => {
//     console.log(totalPosts);
//     if (currentPage < Math.ceil(totalPosts / articlesPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Handle previous page function
//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const toggleLike = async (index, post) => {
//     try {
//       const updatedLikeStates = [...likeStates];
//       if (!likeStates[index].isLiked) {
//         // If not liked, create a new like
//         await PostLikesService.createPostLike({
//           post_id: post.post_id,
//           user_id: current_user_id,
//         });

//         // Update local storage
//         localStorage.setItem(`like_${post.post_id}`, true);

        // // Update post like count
        // const updatedLikeCount = Math.max(post.like_count + 1, 0);
        // const updatedPost = { ...post, like_count: updatedLikeCount };
        // await PostsService.updatePost(post.post_id, updatedPost);

//         updatedLikeStates[index] = {
//           isLiked: true,
//           likeCount: updatedLikeStates[index].likeCount + 1,
//         };
//       } else {
//         // If liked, delete the like
//         await PostLikesService.deletePostLike(post.post_id);

//         // Update local storage
//         localStorage.setItem(`like_${post.post_id}`, false);

        // // Update post like count
        // const updatedLikeCount = Math.max(post.like_count - 1, 0);
        // const updatedPost = { ...post, like_count: updatedLikeCount };
        // await PostsService.updatePost(post.post_id, updatedPost);

//         updatedLikeStates[index] = {
//           isLiked: false,
//           likeCount: updatedLikeStates[index].likeCount - 1,
//         };
//       }
//       setLikeStates(updatedLikeStates);
//     } catch (error) {
//       console.error("Error toggling like:", error.message);
//     }
//   };

//   return (
//     <div>
//       {showPostForm ? (
//         <PostForm onClose={closePostForm} />
//       ) : (
//         <>
//           <div className="w-full grid grid-cols-12 gap-5 mb-12">
//             <div className="col-span-2 text-3xl font-semibold mt-3">
//               Explore
//             </div>
//             <div className="col-span-4 w-full rounded-full h-12 mt-2 bg-white border border-gray-400 flex items-center">
//               <FontAwesomeIcon
//                 icon={faSearch}
//                 className="text-xl font-semibold ml-4 "
//               />
//               <input
//                 className="rounded-full p-2 ml-2 focus:outline-none"
//                 type="text"
//                 placeholder="Search Posts..."
//                 onChange={(e) => handleSearchChange(e.target.value)} // Attach handleSearchChange function
//               />
//             </div>

//             <div className="col-span-2 flex flex-row justify-start items-center mt-1">
//               <div className="text-gray-500 text-xl font-medium mr-2">
//                 Type:
//               </div>
//               <div className="flex flex-row items-center mt-1">
//                 <select
//                   name="event_status"
//                   value={selectedType}
//                   onChange={handleTypeChange}
//                   className="block appearance-none h-10 w-24 md:w-24 xl:w-28 border-b-4 border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-1 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="all">All</option>
//                   <option value="article">Articles</option>
//                   <option value="blog">Blogs</option>
//                   <option value="student-stories">Stories</option>
//                 </select>
//                 <div className="-ml-8 flex items-center pointer-events-none">
//                   <FontAwesomeIcon
//                     icon={faChevronDown}
//                     className="text-blue-700 font-bold text-md"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2 flex flex-row justify-start items-center mt-1">
//               <div className="text-gray-500 text-xl font-medium mr-2">
//                 Filter:
//               </div>
//               <div className="flex flex-row items-center mt-1">
//                 <select
//                   name="event_status"
//                   // value={filters.event_status}
//                   // onChange={handleFilterChange}
//                   className="block appearance-none h-10 w-24 md:w-24 xl:w-28 border-b-4 border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-1 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                 >
//                   <option value="all">All</option>
//                   <option value="articles">Articles</option>
//                   <option value="blogs">Blogs</option>
//                   <option value="stories">Stories</option>
//                 </select>
//                 <div className="-ml-8 flex items-center pointer-events-none">
//                   <FontAwesomeIcon
//                     icon={faChevronDown}
//                     className="text-blue-700 font-bold text-md"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2 flex flex-row justify-end items-end">
//               <button
//                 className="rounded-full h-12 bg-blue-600 text-white px-6 text-lg  transition-all duration-300 transform hover:scale-105"
//                 onClick={handleWriteNewClick}
//               >
//                 <FontAwesomeIcon icon={faEdit} className="mr-2 text-lg" />
//                 Write new
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-12 gap-6 xl:gap-10">
//             {currentPosts.map((post, index) => (
//               <div key={index} className="col-span-6 bg-white rounded-3xl">
//                 <div className="grid grid-cols-12">
//                   <div className="col-span-6">
//                     <img
//                       src={
//                         post.is_link
//                           ? post.post_img
//                           : getImageUrl(post.post_img)
//                       }
//                       alt={`post-${index}`}
//                       className="w-full h-full rounded-l-3xl"
//                     />
//                   </div>

//                   <div className="p-4 col-span-6 flex flex-col">
//                     <div className="flex flex-row justify-between items-end">
//                       <div className="text-xs md:text-md font-medium">
//                         <TimeAgo date={post.cdate_time.toString()} />
//                       </div>
//                       <FontAwesomeIcon icon={faBookmark} className="text-md" />
//                     </div>
//                     <div className="my-2 w-full flex flex-row justify-start items-start">
//                       <img
//                         src={post?.post_author?.img}
//                         className="w-8 h-8 rounded-full mr-2"
//                       />
//                       <div className="text-md mt-1 font-semibold">
//                         {post?.post_author?.name}
//                       </div>
//                     </div>
//                     <div className="font-semibold lg:text-sm xl:text-xl mt-1 xl:mt-3">
//                       {post.post_name}
//                     </div>
//                     <div className="text-xs xl:text-lg line-clamp-2">
//                       {post.post_short_desc}
//                     </div>
//                     <div className="text-xs md:text-md flex flex-row justify-between items-end w-full">
//                       <div>
//                         <FontAwesomeIcon
//                           icon={likeStates[index].isLiked ? solid : faThumbsUp}
//                           onClick={() => toggleLike(index, post)}
//                           className={`mr-3 xl:text-lg cursor-pointer ${
//                             likeStates[index].isLiked ? "text-blue-500" : ""
//                           }`}
//                         />
//                         <span className="text-lg">
//                           {likeStates[index].likeCount}
//                         </span>
//                       </div>
//                       {/* <div>
//                         <FontAwesomeIcon
//                           icon={
//                             likeStates[index] && likeStates[index].isLiked
//                               ? faThumbsDown
//                               : faThumbsUp
//                           }
//                           onClick={() => toggleLike(index, post)}
//                           className={`cursor-pointer ${
//                             likeStates[index] && likeStates[index].isLiked
//                               ? "text-blue-500"
//                               : ""
//                           }`}
//                         />
//                         {likeStates[index] && likeStates[index].likeCount}
//                       </div> */}

//                       <div>
//                         <FontAwesomeIcon
//                           icon={faComment}
//                           className="mr-3 xl:text-lg"
//                         />
//                         {/* {post.commentCount} */}
//                         <span className="text-lg">69</span>
//                       </div>
//                       <FontAwesomeIcon
//                         icon={faEllipsisH}
//                         className="text-lg text-black mt-8  mr-2 xl:text-lg cursor-pointer"
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           handleDropdownToggle(event, post.post_id); // Pass the post_id to handleDropdownToggle
//                         }}
//                       />
//                       {showDropdown && (
//                         <div
//                           style={{
//                             ...dropdownStyle,
//                             top: dropdownPosition.top + "px",
//                             left: dropdownPosition.left + "px",
//                           }}
//                         >
//                           <button
//                             className={dropdownButtonStyle}
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               handleEdit(clickedPostId);
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className={dropdownButtonStyle}
//                             onClick={() => handleDelete(clickedPostId)}
//                           >
//                             Delete
//                           </button>
//                           <button
//                             className={dropdownButtonStyle}
//                             onClick={() => {
//                               window.open(
//                                 `/show-post/${clickedPostId}`,
//                                 "_blank"
//                               );
//                               setShowDropdown(false);
//                             }}
//                           >
//                             View Post
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="col-span-12 flex flex-row">
//               <div className="w-24 px-4 py-1.5 rounded-full flex flex-row h-10 bg-blue-600 text-white text-xl">
//                 <FontAwesomeIcon
//                   onClick={handlePrevPage}
//                   icon={faArrowLeftLong}
//                   className={`mt-1 cursor-pointer ${
//                     currentPage === 1 ? "text-blue-500 pointer-events-none" : ""
//                   }`}
//                 />
//                 <span className="text-xl font-semibold mx-2"> | </span>
//                 <FontAwesomeIcon
//                   onClick={handleNextPage}
//                   disabled={indexOfLastPost >= totalPosts}
//                   icon={faArrowRightLong}
//                   className={`mt-1 cursor-pointer ${
//                     indexOfLastPost >= totalPosts
//                       ? "text-blue-500 pointer-events-none"
//                       : ""
//                   }`}
//                 />
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
