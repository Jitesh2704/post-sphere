import React, { useState, useEffect } from "react";
import PostLikesService from "../../../services/post-service/post-likes.service";
import UserCollectionsService from "../../../services/post-service/user-collections.service";
import TimeAgo from "./TimeAgo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faBookmark as solidBookmark,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark,
  faThumbsUp,
  faBookmark as regularBookmark,
} from "@fortawesome/free-regular-svg-icons";

const ArticlePostTemplate = ({ data }) => {
  const { user } = useSelector((state) => state.auth);
  const user_id = user?.user_id;

  const [isBookmarked, setIsBookmarked] = useState(
    localStorage.getItem(`bookmark_${data.post_id}`) === "true"
  );
  const [isLiked, setIsLiked] = useState(
    localStorage.getItem(`like_${data.post_id}`) === "true"
  );
  const [likeCount, setLikeCount] = useState(data.like_count);

  // const toggleBookmark = async () => {
  //   try {
  //     if (!isBookmarked) {
  //       // If not bookmarked, create a new bookmark
  //       await UserCollectionsService.createUserCollection({
  //         post_id: data.post_id,
  //         user_id: user_id,
  //       });
  //       setIsBookmarked(true);
  //       localStorage.setItem(`bookmark_${data.post_id}`, true);
  //     } else {
  //       // If bookmarked, delete the bookmark
  //       await UserCollectionsService.deleteUserCollection(
  //         data.post_id,
  //         user_id
  //       );
  //       setIsBookmarked(false);
  //       localStorage.setItem(`bookmark_${data.post_id}`, false);
  //     }
  //     // window.location.reload();
  //   } catch (error) {
  //     console.error("Error toggling bookmark:", error.message);
  //   }
  // };

  // const toggleBookmark = async () => {
  //   try {
  //     if (!isBookmarked) {
  //       // If not bookmarked, create a new bookmark
  //       await UserCollectionsService.createUserCollection({
  //         post_id: data.post_id,
  //         user_id: user_id,
  //       });
  //       setIsBookmarked(true);
  //       localStorage.setItem(`bookmark_${data.post_id}`, true);
  //     } else {
  //      await UserCollectionsService.deleteUserCollection(
  //         data.post_id,
  //         user_id
  //       );
  //       setIsBookmarked(false);
  //       localStorage.setItem(`bookmark_${data.post_id}`, false);
  //     }
  //   } catch (error) {
  //     console.error("Error toggling bookmark:", error.message);
  //   }
  // };

  const toggleBookmark = async () => {
    try {
      if (!isBookmarked) {
        //  const collection = await UserCollectionsService.getUserCollection({
        //   post_id: data.post_id,
        //   user_id: user_id,
        // });
        // if (collection.is_deleted) {
        //   // If it's deleted, change the bookmark icon to normal and don't do anything
        //   setIsBookmarked(true);
        //   localStorage.setItem(`bookmark_${data.post_id}`, true);
        //   return;
        // } else {
        // If not bookmarked, create a new bookmark
        await UserCollectionsService.createUserCollection({
          post_id: data.post_id,
          user_id: user_id,
        });
        setIsBookmarked(true);
        localStorage.setItem(`bookmark_${data.post_id}`, true);
        // }
      } else {
        // If bookmarked, check if it's deleted
        const collection = await UserCollectionsService.getUserCollection({
          post_id: data.post_id,
          user_id: user_id,
        });
        if (collection.is_deleted) {
          // If it's deleted, change the bookmark icon to normal and don't do anything
          setIsBookmarked(false);
          localStorage.setItem(`bookmark_${data.post_id}`, false);
          return;
        } else {
          // If it's not deleted, proceed with unbookmarking
          await UserCollectionsService.deleteUserCollection(
            data.post_id,
            user_id
          );
          setIsBookmarked(false);
          localStorage.setItem(`bookmark_${data.post_id}`, false);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
    }
  };

  const toggleLike = async () => {
    try {
      if (!isLiked) {
        // If not liked, create a new like
        await PostLikesService.createPostLike({
          post_id: data.post_id,
          created_by: user_id,
        });
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
        localStorage.setItem(`like_${data.post_id}`, true);
      } else {
        // If liked, delete the like
        await PostLikesService.deletePostLike(data.post_id, user_id);
        setIsLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
        localStorage.setItem(`like_${data.post_id}`, false);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/show-post/${data.post_id}/`);
  };

  return (
    <div className="w-full h-auto p-0.5 md:p-2">
      <div className="flex justify-start items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={
              data?.post_author?.img ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/640px-Outdoors-man-portrait_%28cropped%29.jpg"
            }
            alt={
              data?.post_author?.name
                ? `${data.post_author.name} Profile Image`
                : "Unknown Profile Image"
            }
          />
        </div>

        <div className="font-semibold text-md">
          {data?.post_author?.name || "Unknown Author"}
        </div>
        <div className="font-semibold text-md text-gray-400">
          <TimeAgo date={data?.cdate_time?.toString()} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 md:gap-5 my-3 md:my-2">
        <div className="col-span-12 md:col-span-7">
          <div className="font-bold tracking-tight text-lg md:text-xl">
            {data.post_name}
          </div>
          <div className="py-1 tracking-tight my-0.5 md:my-3">
            {data.post_short_desc}
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
            <img
              className="object-cover h-fit w-full"
              src={data.post_img}
              alt="Post Image"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 md:gap-5">
          {data.tags &&
            data.tags.map((tag, index) => (
              <div
                className="bg-gray-200 tracking-tight text-xs md:text-sm rounded-full font-semibold py-1 px-2"
                key={index}
              >
                {tag}
              </div>
            ))}
        </div>

        <div className="flex justify-around gap-3 md:gap-6 mt-3">
          {likeCount}
          <FontAwesomeIcon
            icon={isLiked ? faThumbsDown : faThumbsUp}
            onClick={toggleLike}
            className={`cursor-pointer ${isLiked ? "text-blue-500" : ""}`}
          />
          <FontAwesomeIcon
            icon={isBookmarked ? solidBookmark : regularBookmark}
            onClick={toggleBookmark}
            className={`cursor-pointer ${isBookmarked ? "text-blue-500" : ""}`}
          />
          {/* <FontAwesomeIcon
            icon={solidBookmark}
            onClick={toggleBookmark}
            className={`cursor-pointer text-blue-500`}
          /> */}
        </div>
      </div>
      <button
        className="mt-4 px-2 py-2 w-fit border hover:border-blue-500 rounded-lg"
        onClick={handleButtonClick}
      >
        <div className="text-xs font-bold text-blue-700 hover:text-blue-500">
          View Post
        </div>
      </button>
    </div>
  );
};

export default ArticlePostTemplate;

// import React, { useState, useEffect } from "react";
// import PostLikesService from "../../../services/post-service/post-likes.service";
// import UserCollectionsService from "../../../services/post-service/user-collections.service";
// import TimeAgo from "./TimeAgo";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsDown,
//   faBookmark as solidBookmark,
//   faThumbsUp as solidThumbsUp,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   faBookmark,
//   faThumbsUp,
//   faBookmark as regularBookmark,
// } from "@fortawesome/free-regular-svg-icons";

// const ArticlePostTemplate = ({ data }) => {
//   const { user } = useSelector((state) => state.auth);
//   const user_id = user?.user_id;

//   const [isBookmarked, setIsBookmarked] = useState(
//     localStorage.getItem(`bookmark_${data.post_id}`) === "true"
//   );
//   const [isLiked, setIsLiked] = useState(
//     localStorage.getItem(`like_${data.post_id}`) === "true"
//   );
//   const [likeCount, setLikeCount] = useState(data.like_count);

//   const bookMarker = async () => {
//     try {
//       const response = await UserCollectionsService.createUserCollection({
//         post_id: data.post_id,
//         user_id: user_id,
//       });
//       console.log("Response at frontend: ", response.data);
//     } catch (error) {
//       console.error("Error creating user collection:", error.message);
//     }
//   };

//   // const bookMarker = async () => {
//   //   try {
//   //     // Check if the user collection already exists
//   //     const existingCollection = await UserCollectionsService.getUserCollection(
//   //       {
//   //         post_id: data.post_id,
//   //         user_id: user_id,
//   //       }
//   //     );

//   //     if (!existingCollection) {
//   //       // If no existing collection, create a new one
//   //       const response = await UserCollectionsService.createUserCollection({
//   //         post_id: data.post_id,
//   //         user_id: user_id,
//   //       });
//   //       console.log("Response at frontend: ", response.data);
//   //     } else {
//   //       console.log("User collection already exists");
//   //     }
//   //   } catch (error) {
//   //     console.error(
//   //       "Error creating or checking user collection:",
//   //       error.message
//   //     );
//   //   }
//   // };

//   const deleteBookMarker = async () => {
//     try {
//       await UserCollectionsService.deleteUserCollection(data.post_id, user_id);
//       console.log("User collection deleted");
//     } catch (error) {
//       console.error("Error deleting user collection:", error.message);
//     }
//   };

//   // const toggleBookmark = async () => {
//   //   try {
//   //     if (!isBookmarked) {
//   //       await bookMarker();
//   //       setIsBookmarked(true);
//   //       localStorage.setItem(`bookmark_${data.post_id}`, true);
//   //     } else {
//   //       await deleteBookMarker();
//   //       setIsBookmarked(false);
//   //       localStorage.setItem(`bookmark_${data.post_id}`, false);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error toggling bookmark:", error.message);
//   //   }
//   // };

//   const toggleBookmark = async () => {
//     try {
//       // Check if there is an existing bookmark
//       const existingBookmark = await UserCollectionsService.getAllUserCollections(1, 10, [], {
//         post_id: data.post_id,
//         user_id: user_id,
//       });

//       console.log("hello",existingBookmark);

//       if (existingBookmark.length === 0) {
//         // If no existing bookmark, create a new one
//         await bookMarker();
//         setIsBookmarked(true);
//         localStorage.setItem(`bookmark_${data.post_id}`, true);
//       } else {
//         // If bookmark exists, delete it
//         await UserCollectionsService.deleteUserCollection(
//           data.post_id,
//           user_id
//         );
//         setIsBookmarked(false);
//         localStorage.setItem(`bookmark_${data.post_id}`, false);
//       }
//     } catch (error) {
//       console.error("Error toggling bookmark:", error.message);
//     }
//   };

//   const toggleLike = async () => {
//     try {
//       if (!isLiked) {
//         await PostLikesService.createPostLike({
//           post_id: data.post_id,
//           created_by: user_id,
//         });
//         setIsLiked(true);
//         setLikeCount((prevCount) => prevCount + 1);
//         localStorage.setItem(`like_${data.post_id}`, true);
//       } else {
//         await PostLikesService.deletePostLike(data.post_id, user_id);
//         setIsLiked(false);
//         setLikeCount((prevCount) => prevCount - 1);
//         localStorage.setItem(`like_${data.post_id}`, false);
//       }
//     } catch (error) {
//       console.error("Error toggling like:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (isBookmarked) {
//       bookMarker();
//     }
//   }, [isBookmarked]);

//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate(`/show-post/${data.post_id}`);
//   };

//   return (
//     <div className="max-w-screen-sm md:max-w-screen-md h-auto p-0.5 md:p-2">
//       <div className="flex justify-start items-center space-x-2">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             className="object-cover w-full h-full"
//             src={
//               data?.post_author?.img ||
//               "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/640px-Outdoors-man-portrait_%28cropped%29.jpg"
//             }
//             alt={
//               data?.post_author?.name
//                 ? `${data.post_author.name} Profile Image`
//                 : "Unknown Profile Image"
//             }
//           />
//         </div>

//         <div className="font-semibold text-md">
//           {data?.post_author?.name || "Unknown Author"}
//         </div>
//         <div className="font-semibold text-md text-gray-400">
//           <TimeAgo date={data?.cdate_time?.toString()} />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-0 md:gap-5 my-3 md:my-2">
//         <div className="col-span-12 md:col-span-9">
//           <div className="font-bold tracking-tight text-lg md:text-xl line-clamp-1">
//             {data.post_name}
//           </div>
//           <div className="py-1 tracking-tight my-0.5 md:my-3 line-clamp-3">
//             {data.post_short_desc}
//           </div>
//         </div>
//         <div className="col-span-12 md:col-span-3">
//           <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
//             <img
//               className="object-cover h-full w-full"
//               src={data.post_img}
//               alt="Post Image"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between items-center">
//         <div className="flex gap-1 md:gap-5">
//           {data.tags &&
//             data.tags.map((tag, index) => (
//               <div
//                 className="bg-gray-200 tracking-tight text-xs md:text-sm rounded-full font-semibold py-1 px-2"
//                 key={index}
//               >
//                 {tag}
//               </div>
//             ))}
//         </div>

//         <div className="flex justify-around gap-3 md:gap-6 mt-3">
//           {likeCount}
//           <FontAwesomeIcon
//             icon={isLiked ? faThumbsDown : faThumbsUp}
//             onClick={toggleLike}
//             className={`cursor-pointer ${isLiked ? "text-blue-500" : ""}`}
//           />
//           <FontAwesomeIcon
//             icon={faBookmark}
//             onClick={toggleBookmark}
//             className={`cursor-pointer ${isBookmarked ? "text-blue-500" : ""}`}
//           />
//         </div>
//       </div>
//       <button
//         className="mt-4 px-2 py-2 w-fit border hover:border-blue-500 rounded-lg"
//         onClick={handleButtonClick}
//       >
//         <div className="text-xs font-bold text-blue-700 hover:text-blue-500">
//           View Details
//         </div>
//       </button>
//     </div>
//   );
// };

// export default ArticlePostTemplate;

// import React, { useState, useEffect } from "react";
// import PostLikesService from "../../../services/post-service/post-likes.service";
// import UserCollectionsService from "../../../services/post-service/user-collections.service";
// import TimeAgo from "./TimeAgo";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsDown,
//   faBookmark as solidBookmark,
//   faThumbsUp as solidThumbsUp,
// } from "@fortawesome/free-solid-svg-icons";
// import { faBookmark, faThumbsUp, faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

// const ArticlePostTemplate = ({ data }) => {
//     const { user } = useSelector((state) => state.auth);
//     const user_id = user?.user_id;

//     const [isBookmarked, setIsBookmarked] = useState(
//         localStorage.getItem(`bookmark_${data.post_id}`) === "true"
//     );
//     const [isLiked, setIsLiked] = useState(
//         localStorage.getItem(`like_${data.post_id}`) === "true"
//     );
//     const [likeCount, setLikeCount] = useState(data.like_count);

//     const bookMarker = async () => {
//         try {
//             const response = await UserCollectionsService.createUserCollection({
//                 post_id: data.post_id,
//                 user_id: user_id,
//             });
//             console.log("Response at frontend: ", response.data);
//         } catch (error) {
//             console.error("Error creating user collection:", error.message);
//         }
//     };

//     const toggleBookmark = async () => {
//         try {
//             setIsBookmarked((prev) => !prev);
//             localStorage.setItem(`bookmark_${data.post_id}`, !isBookmarked);
//         } catch (error) {
//             console.error("Error toggling bookmark:", error.message);
//         }
//     };

//     const toggleLike = async () => {
//         try {
//             if (!isLiked) {
//                 await PostLikesService.createPostLike({
//                     post_id: data.post_id,
//                     created_by: user_id,
//                 });
//                 setIsLiked(true);
//                 setLikeCount((prevCount) => prevCount + 1);
//                 localStorage.setItem(`like_${data.post_id}`, true);
//             } else {
//                 await PostLikesService.deletePostLike(data.post_id, user_id);
//                 setIsLiked(false);
//                 setLikeCount((prevCount) => prevCount - 1);
//                 localStorage.setItem(`like_${data.post_id}`, false);
//             }
//         } catch (error) {
//             console.error("Error toggling like:", error.message);
//         }
//     };

//     useEffect(() => {
//         if (isBookmarked) {
//             bookMarker(data.post_id, user_id);
//         }
//     }, [isBookmarked]);

//     const navigate = useNavigate();

//     const handleButtonClick = () => {
//         navigate(`/show-post/${data.post_id}/${data.created_by}`);
//     };

//     return (
//         <div className="max-w-screen-sm md:max-w-screen-md h-auto p-0.5 md:p-2">
//             <div className="flex justify-start items-center space-x-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                     <img
//                         className="object-cover w-full h-full"
//                         src={
//                             data?.post_author?.img ||
//                             "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/640px-Outdoors-man-portrait_%28cropped%29.jpg"
//                         }
//                         alt={
//                             data?.post_author?.name
//                                 ? `${data.post_author.name} Profile Image`
//                                 : "Unknown Profile Image"
//                         }
//                     />
//                 </div>

//                 <div className="font-semibold text-md">
//                     {data?.post_author?.name || "Unknown Author"}
//                 </div>
//                 <div className="font-semibold text-md text-gray-400">
//                     <TimeAgo date={data?.cdate_time?.toString()} />
//                 </div>
//             </div>

//             <div className="grid grid-cols-12 gap-0 md:gap-5 my-3 md:my-2">
//                 <div className="col-span-12 md:col-span-9">
//                     <div className="font-bold tracking-tight text-lg md:text-xl line-clamp-1">
//                         {data.post_name}
//                     </div>
//                     <div className="py-1 tracking-tight my-0.5 md:my-3 line-clamp-3">
//                         {data.post_short_desc}
//                     </div>
//                 </div>
//                 <div className="col-span-12 md:col-span-3">
//                     <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
//                         <img
//                             className="object-cover h-full w-full"
//                             src={data.post_img}
//                             alt="Post Image"
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="flex justify-between items-center">
//                 <div className="flex gap-1 md:gap-5">
//                     {data.tags &&
//                         data.tags.map((tag, index) => (
//                             <div
//                                 className="bg-gray-200 tracking-tight text-xs md:text-sm rounded-full font-semibold py-1 px-2"
//                                 key={index}
//                             >
//                                 {tag}
//                             </div>
//                         ))}
//                 </div>

//                 <div className="flex justify-around gap-3 md:gap-6 mt-3">
//                     {likeCount}
//                     <FontAwesomeIcon
//                         icon={isLiked ? faThumbsDown : faThumbsUp}
//                         onClick={toggleLike}
//                         className={`cursor-pointer ${isLiked ? "text-blue-500" : ""}`}
//                     />
//                     <FontAwesomeIcon
//                         icon={faBookmark}
//                         onClick={toggleBookmark}
//                         className={`cursor-pointer ${isBookmarked ? "text-blue-500" : ""}`}
//                     />
//                 </div>
//             </div>
//             <button
//                 className="mt-4 px-2 py-2 w-fit border hover:border-blue-500 rounded-lg"
//                 onClick={handleButtonClick}
//             >
//                 <div className="text-xs font-bold text-blue-700 hover:text-blue-500">
//                     View Details
//                 </div>
//             </button>
//         </div>
//     );
// };

// export default ArticlePostTemplate;

// import React, { useState, useEffect } from "react";
// import PostLikesService from "../../../services/post-service/post-likes.service";
// import UserCollectionsService from "../../../services/post-service/user-collections.service";
// import TimeAgo from "./TimeAgo";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsDown,
//   faBookmark as solidBookmark,
//   faThumbsUp as solidThumbsUp,
// } from "@fortawesome/free-solid-svg-icons";
// import { faBookmark, faThumbsUp, faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

// const ArticlePostTemplate = ({ data }) => {
//     const { user } = useSelector((state) => state.auth);
//     const user_id = user?.user_id;
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(data.like_count);

//   const bookMarker = async () => {
//     try {
//       const response = await UserCollectionsService.createUserCollection({
//         post_id: data.post_id,
//         user_id: user_id, // Pass user_id as a parameter
//       });
//       console.log("Response at frontend: ", response.data);
//     } catch (error) {
//       console.error("Error creating user collection:", error.message);
//     }
//   };

//   const toggleBookmark = async () => {
//     try {
//       setIsBookmarked((prev) => !prev);
//     } catch (error) {
//       console.error("Error toggling bookmark:", error.message);
//     }
//   };

//   const toggleLike = async () => {
//     try {
//       if (!isLiked) {
//         // Like the post if not already liked
//         await PostLikesService.createPostLike({
//           post_id: data.post_id,
//           created_by: user_id,
//         });
//         setIsLiked(true);
//         setLikeCount((prevCount) => prevCount + 1);
//         console.log("Post liked");
//       } else {
//         // Unlike the post if already liked
//         // You need to implement the corresponding service function for this
//         // Assuming a service function to delete the like by user_id and post_id
//         await PostLikesService.deletePostLike(data.post_id, user_id);
//         setIsLiked(false);
//         setLikeCount((prevCount) => prevCount - 1);
//         console.log("Post unliked");
//       }
//     } catch (error) {
//       console.error("Error toggling like:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (isBookmarked) {
//       bookMarker(data.post_id, user_id); // Pass user_id and post_id
//     }
//   }, [isBookmarked]);

//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate(`/show-post/${data.post_id}/${data.created_by}`);
//   };

//   return (
//     <div className="max-w-screen-sm md:max-w-screen-md h-auto p-0.5 md:p-2">
//       <div className="flex justify-start items-center space-x-2">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             className="object-cover w-full h-full"
//             src={
//               data?.post_author?.img ||
//               "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/640px-Outdoors-man-portrait_%28cropped%29.jpg"
//             }
//             alt={
//               data?.post_author?.name
//                 ? `${data.post_author.name} Profile Image`
//                 : "Unknown Profile Image"
//             }
//           />
//         </div>

//         <div className="font-semibold text-md">
//           {data?.post_author?.name || "Unknown Author"}
//         </div>
//         <div className="font-semibold text-md text-gray-400">
//           <TimeAgo date={data?.cdate_time?.toString()} />
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-0 md:gap-5 my-3 md:my-2">
//         <div className="col-span-12 md:col-span-9">
//           <div className="font-bold tracking-tight text-lg md:text-xl line-clamp-1">
//             {data.post_name}
//           </div>
//           <div className="py-1 tracking-tight my-0.5 md:my-3 line-clamp-3">
//             {data.post_short_desc}
//           </div>
//         </div>
//         <div className="col-span-12 md:col-span-3">
//           <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
//             <img
//               className="object-cover h-full w-full"
//               src={data.post_img}
//               alt="Post Image"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between items-center">
//         <div className="flex gap-1 md:gap-5">
//           {data.tags &&
//             data.tags.map((tag, index) => (
//               <div
//                 className="bg-gray-200 tracking-tight text-xs md:text-sm rounded-full font-semibold py-1 px-2"
//                 key={index}
//               >
//                 {tag}
//               </div>
//             ))}
//         </div>

//         <div className="flex justify-around gap-3 md:gap-6 mt-3">
//           {likeCount}
//           <FontAwesomeIcon
//             icon={isLiked ? faThumbsDown : faThumbsUp}
//             onClick={toggleLike}
//             className={`cursor-pointer ${isLiked ? "text-blue-500" : ""}`}
//           />
//           <FontAwesomeIcon
//             icon={faBookmark}
//             onClick={toggleBookmark}
//             className={`cursor-pointer ${isBookmarked ? "text-blue-500" : ""}`}
//           />
//         </div>
//       </div>
//       <button
//         className="mt-4 px-2 py-2 w-fit border hover:border-blue-500 rounded-lg"
//         onClick={handleButtonClick}
//       >
//         <div className="text-xs font-bold text-blue-700 hover:text-blue-500">
//           View Details
//         </div>
//       </button>
//     </div>
//   );
// };

// export default ArticlePostTemplate;

// import React, { useState, useEffect } from "react";
// import PostLikesService from "../../../services/post-service/post-likes.service";
// import UserCollectionsService from "../../../services/post-service/user-collections.service";
// import TimeAgo from "./TimeAgo";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBookmark as solidBookmark,
//   faEllipsis,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   faBookmark as regularBookmark,
//   faThumbsUp as regularThumbsUp,
// } from "@fortawesome/free-regular-svg-icons";

// const ArticlePostTemplate = ({ data }) => {
//   const user_id = 1; // Assuming user_id is a number
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);

// const bookMarker = async (pId, uId) => {
//   try {
//     const response = await UserCollectionsService.createUserCollection({
//       post_id: pId,
//       user_id: uId, // Pass user_id as a parameter
//     });
//     console.log("Response at frontend: ", response.data);
//   } catch (error) {
//     console.error("Error creating user collection:", error.message);
//   }
// };

//   const like = async (pId, uId) => {
//     try {
//       const response = await PostLikesService.createPostLike({
//         post_id: pId,
//         user_id: uId, // Pass user_id as a parameter
//       });
//       console.log("Response at frontend: ", response.data);
//     } catch (error) {
//       console.error("Error creating post like:", error.message);
//     }
//   };

// const toggleBookmark = () => {
//   setIsBookmarked((prev) => !prev);
// };

//   const toggleLike = () => {
//     setIsLiked((prev) => !prev);
//   };

//   // Inside useEffect for bookmarking and liking

// useEffect(() => {
//   if (isBookmarked) {
//     bookMarker(data.post_id, user_id); // Pass user_id and post_id
//   }
// }, [isBookmarked]);

//   useEffect(() => {
//     if (isLiked) {
//       like(data.post_id, user_id); // Pass user_id and post_id
//     }
//   }, [isLiked]);

//   useEffect(() => {
//     // Fetch like count when component mounts
//     const fetchLikeCount = async () => {
//       try {
//         const count = await PostLikesService.getLikeCountForPost(data.post_id); // Fetch like count for the current post using post_id
//         setLikeCount(count); // Update like count state
//       } catch (error) {
//         console.error("Error fetching like count:", error.message);
//       }
//     };

//     fetchLikeCount();
//   }, [data.post_id]); // Run effect when post_id changes

//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate(`/show-post/${data.post_id}/${data.created_by}`);
//   };

//   return (
//     <div className="max-w-screen-sm md:max-w-screen-md h-auto p-0.5 md:p-2">
//       <div className="flex justify-start items-center space-x-2">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             className="object-cover w-full h-full"
//             src={data.post_author.img}
//             alt={data.post_author.name + "Profile Image"}
//           />
//         </div>

//         <div className="font-semibold text-md">{data.post_author.name}</div>
//         <div className="font-semibold text-md text-gray-400">
//           <TimeAgo date={data?.cdate_time?.toString()} />
//         </div>
//       </div>
//       <div className="grid grid-cols-12 gap-0 md:gap-5 my-3 md:my-2">
//         <div className="col-span-12 md:col-span-9">
//           <div className="font-bold tracking-tight text-lg md:text-xl line-clamp-1">
//             {data.post_name}
//           </div>
//           <div className="py-1 tracking-tight my-0.5 md:my-3 line-clamp-3">
//             {data.post_short_desc}
//           </div>
//         </div>
//         <div className="col-span-12 md:col-span-3">
//           <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
//             <img
//               className="object-cover h-full w-full"
//               src={data.post_img}
//               alt="Post Image"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between items-center">
//         <div className="flex gap-1 md:gap-5">
//           {data.tags.map((tag, index) => (
//             <div
//               className="bg-gray-200 tracking-tight text-xs md:text-sm rounded-full font-semibold py-1 px-2"
//               key={index}
//             >
//               {tag}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-around gap-3 md:gap-6">
//           {likeCount}
//           {isLiked ? (
//             <FontAwesomeIcon
//               icon={faThumbsUp}
//               onClick={toggleLike}
//               className="cursor-pointer text-black"
//             />
//           ) : (
//             <FontAwesomeIcon
//               icon={regularThumbsUp}
//               onClick={toggleLike}
//               className="cursor-pointer"
//             />
//           )}
//           {isBookmarked ? (
//             <FontAwesomeIcon
//               icon={solidBookmark}
//               onClick={toggleBookmark}
//               className="cursor-pointer text-black"
//             />
//           ) : (
//             <FontAwesomeIcon
//               icon={regularBookmark}
//               onClick={toggleBookmark}
//               className="cursor-pointer"
//             />
//           )}
//         </div>
//       </div>
//       <button
//         className="mt-4 px-2 py-2 w-fit border hover:border-blue-500 rounded-lg"
//         onClick={handleButtonClick}
//       >
//         <div className="text-xs font-bold text-blue-700 hover:text-blue-500">
//           View Details
//         </div>
//       </button>
//     </div>
//   );
// };

// export default ArticlePostTemplate;
