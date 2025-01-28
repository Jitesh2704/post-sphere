import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostsService from "../../../services/post-service/posts.service";
import { FaTimes } from "react-icons/fa";
import TimeAgo from "./TimeAgo";
import UserCollectionsService from "../../../services/post-service/user-collections.service";

const SmallPostTemplate = ({ post_id }) => {
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const [post, setPost] = useState(null);
  const [showPost, setShowPost] = useState(true);


  const fetchPost = async () => {
    try {
      const response = await PostsService.getPost({ post_id: post_id });
      // console.log("fetched post", response);
      setPost(response.data);
    } catch (error) {
      console.log("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [post_id]);

  // const handleDeleteUserCollection = async () => {
  //   try {
  //     await UserCollectionsService.deleteUserCollection(
  //       post_id,
  //       current_user_id
  //     );
  //     // Show alert
  //     alert("Removed from Collection");
  //     fetchPost();
  //   } catch (error) {
  //     console.error("Error deleting user collection:", error);
  //   }
  // };

  const handleClick = () => {
    setShowPost(!showPost); // Toggle the visibility of the post
  };

  if (!showPost || !post) {
    return null; // If showPost is false or post is null, don't render anything
  }

  return (
    <div className="max-w-screen-md mx-auto cursor-pointer">
      {post && (
        <>
          <div className="flex justify-start items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden mb-2">
              <img
                className="object-cover w-full h-full"
                src={post.post_author.img}
                alt={`${post.post_author.name} Profile Image`}
              />
            </div>

            <div className="font-semibold text-md">{post.post_author.name}</div>
            <div className="font-semibold text-md text-gray-400">
              <TimeAgo date={post.cdate_time} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="font-semibold tracking-tight text-lg line-clamp-2 hover:line-clamp-none">
              {post.post_name}
            </div>
            <div
              className="cursor-pointer p-2"
              // onClick={handleDeleteUserCollection}
              onClick={handleClick}
            >
              <FaTimes />
            </div>
          </div>
          <hr className="my-4 border-t border-gray-300" />
        </>
      )}
    </div>
  );
};

export default SmallPostTemplate;

// import React, { useEffect } from "react";
// import { useState } from "react";
// // import PostServices from "../../services/post-service/post.service";
// import TimeAgo from "./TimeAgo";

// const SmallPostTemplate = ({ data }) => {
//   // console.log("Small post is called");
//   const [post, setPost] = useState();

//   const fetchPost = async (post_id) => {
//     try {
//       const response = await PostServices.getPostById(post_id);
//       setPost(response.data);
//     } catch (error) {
//       console.log("Internal Server error: ", error);
//     }
//   };

//   useEffect(() => {
//     const post_id = data?._id;
//     fetchPost(post_id);
//   }, [data]);

//   return (
//     <div className="max-w-screen-md mx-auto cursor-pointer">
//       <div className="flex justify-start items-center space-x-2">
//         <div className="w-10 h-10 rounded-full overflow-hidden mb-2">
//           <img
//             className="object-cover w-full h-full"
//             src={user?.profile_image}
//             alt={user?.fname + " " + user?.lname + "Profile Image"}
//           />
//         </div>

//         <div className="font-semibold text-md">
//           {user?.fname} {user?.lname}
//         </div>
//         <div className="font-semibold text-md text-gray-400">
//           <TimeAgo date={post?.cdate_time.toString()} />
//         </div>
//       </div>
//       <div className="font-semibold tracking-tight text-lg line-clamp-2 hover:line-clamp-none">
//         {post && post.post_name}
//       </div>
//     </div>
//   );
// };

// export default SmallPostTemplate;
