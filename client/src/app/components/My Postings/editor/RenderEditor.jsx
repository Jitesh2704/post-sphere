import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faBookmark,
  faEllipsisH,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "../templates/TimeAgo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from "./Heading";
import CodeBlock from "./CodeBlock";
import WarningBlock from "./WarningBlock";
import AttachesBlock from "./AttachesBlock";
import QuoteBlock from "./QuoteBlock";
import TableBlock from "./TableBlock";
import ListBlock from "./ListBlock";
import ImageBlock from "./ImageBlock";
import ParagraphBlock from "./ParagraphBlock";
import DelimiterBlock from "./DelimiterBlock";
import RubicsLoader from "../templates/RubicsLoader";
import CountButton from "../templates/CountButton";
import PostLikesService from "../../../services/post-service/post-likes.service";
import { useSelector } from "react-redux";
import UserCollectionsService from "../../../services/post-service/user-collections.service";
import PostsService from "../../../services/post-service/posts.service";
import CommentCount from "../templates/CommentCount";

const RenderEditor = ({ data, scrollToComments }) => {
  console.log("pased data in props", data);
  const [post, setPost] = useState(data);
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setPost(data);
  }, [data]);

  const handleShareClick = () => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Copy the URL to the clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Display success toast
        toast.success("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        // Display error toast
        toast.error("Failed to copy link to clipboard");
      });
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await UserCollectionsService.getUserCollection({
        user_id: user.user_id,
        post_id: post.post_id,
      });

      if (res?.data?.collection_id) {
        await UserCollectionsService.deleteUserCollection(
          res.data.collection_id
        );
        setIsBookmarked(false); // Directly update state
        console.log("Bookmark removed");
        toast.warn("Bookmark removed sucessfully!");
      }
    } catch (error) {
      console.error(
        "Error toggling bookmark, trying to create bookmark:",
        error
      );

      try {
        const create = await UserCollectionsService.createUserCollection({
          user_id: user.user_id,
          post_id: post.post_id,
        });
        setIsBookmarked(true); // Directly update state
        console.log("Added to collection:", create.data);
        toast.success("Added to Collections sucessfully!");
      } catch (createError) {
        console.error("Error creating bookmark:", createError);
      }
    }
  };

  const handleToggleLike = async () => {
    if (!user?.user_id || !post?.post_id) return; // Ensure IDs exist

    let updatedPost = { ...post };

    try {
      const res = await PostLikesService.getPostLike({
        user_id: user.user_id,
        post_id: post.post_id,
      });

      if (res?.data?.post_like_id) {
        const toggle = !res.data.is_liked;

        const [updateLike, updateCount] = await Promise.all([
          PostLikesService.updatePostLike(res.data.post_like_id, {
            ...res.data,
            is_liked: toggle,
          }),
          PostsService.updatePost(post.post_id, {
            ...post,
            like_count: toggle ? post.like_count + 1 : post.like_count - 1,
          }),
        ]);

        updatedPost = updateCount.data;
        console.log("Toggled like:", updateLike.data, updateCount.data);
      }
    } catch (error) {
      console.error("Error toggling like, trying to create like:", error);

      try {
        const [newLike, updateCount] = await Promise.all([
          PostLikesService.createPostLike({
            user_id: user.user_id,
            post_id: post.post_id,
            is_liked: true,
          }),
          PostsService.updatePost(post.post_id, {
            ...post,
            like_count: post.like_count + 1,
          }),
        ]);

        updatedPost = updateCount.data;
        console.log("Liked post:", newLike.data, updateCount.data);
      } catch (createError) {
        console.error("Error creating like:", createError);
      }
    }

    setPost(updatedPost);
    checkStatus();
  };

  const checkStatus = async () => {
    if (!user?.user_id || !post?.post_id) return;

    try {
      const [res1, res2] = await Promise.all([
        PostLikesService.getPostLike({
          user_id: user.user_id,
          post_id: post.post_id,
        }).catch(() => null), // Catch errors for getPostLike and return null
        UserCollectionsService.getUserCollection({
          user_id: user.user_id,
          post_id: post.post_id,
        }).catch(() => null), // Catch errors for getUserCollection and return null
      ]);

      // Handle PostLike response
      if (res1?.data) {
        setIsLiked(res1.data.is_liked);
      } else {
        setIsLiked(false); // If no data, assume not liked
      }

      // Handle UserCollection response
      if (res2?.data) {
        setIsBookmarked(true); // If data exists, assume bookmarked
      } else {
        setIsBookmarked(false); // If no data, assume not bookmarked
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [user?.user_id, post?.post_id]);

  if (!data?.post_id) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <RubicsLoader />
      </div>
    );
  }

  return (
    <div className="px-20 bg-[#131520]">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 flex flex-col">
          <div className="text-4xl font-semibold mb-3">{post.post_name}</div>
          <div className="text-md mb-2 text-justify">
            {post.post_short_desc}
          </div>

          <div className="flex flex-wrap gap-2 my-2">
            {post?.tags?.map((tag) => (
              <div key={tag} className="bg-blue-600 px-3 py-1 w-fit rounded-md">
                #{tag}
              </div>
            ))}
          </div>

          <div className="inline-flex items-center mt-2 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={
                  post.post_author?.img ||
                  "https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg"
                }
                alt="Author Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="inline-flex items-end gap-3">
              <div className="ml-2 text-3xl">{post?.post_author?.name}</div>
              <TimeAgo date={post?.cdate_time} />
            </div>
          </div>

          <div className="mb-2 bg-green-500 text-white font-medium rounded-full px-3 py-1 w-fit">
            {post?.post_type?.charAt(0).toUpperCase() +
              post?.post_type?.slice(1)}
          </div>
        </div>
        <div className="w-full col-span-5 h-full">
          <img
            src={post?.post_img}
            className="object-cover w-full max-h-96 rounded-md"
            alt="post image"
          />
        </div>
      </div>
      <div>
        <div className="border-b border-gray-400 pt-2"></div>
        <div className="flex flex-row items-center justify-between m-3">
          <div className="inline-flex items-start gap-3">
            <CountButton
              isLiked={isLiked}
              count={post?.like_count}
              onClick={handleToggleLike}
            />
            <CommentCount
              forumId={post?.post_forum_id}
              onClick={scrollToComments}
            />
          </div>
          <div className="inline-flex items-start gap-2">
            <button
              className="flex flex-row justify-center items-center font-medium gap-2 bg-blue-600 rounded-full px-4 py-1.5 text-white hover:bg-blue-700"
              onClick={handleShareClick}
            >
              <div className="text-lg">Share the Post</div>
              <FontAwesomeIcon icon={faShare} size="lg" className="ml-1" />
            </button>
            <button
              className={`flex flex-row justify-center font-medium items-center gap-2 rounded-full px-4 py-1.5 text-white hover:${
                isBookmarked ? "bg-orange-700" : "bg-green-700"
              } ${isBookmarked ? "bg-orange-600" : "bg-green-600"}`}
              onClick={handleToggleBookmark}
            >
              <div className="text-lg">
                {isBookmarked ? "Remove Bookmark" : "Add to Collection"}
              </div>
              <FontAwesomeIcon icon={faBookmark} size="lg" className="ml-1" />
            </button>
          </div>
        </div>
        <div className="border-b border-gray-400"></div>
      </div>
      <div className="mt-6 md:mt-12">
        {post?.post_content?.blocks?.map((block) => {
          switch (block.type) {
            case "paragraph":
              return <ParagraphBlock key={block.id} text={block.data.text} />;

            case "warning":
              return <WarningBlock key={block.id} text={block.data} />;

            case "delimiter":
              return <DelimiterBlock key={block.id} />;

            case "header":
              return (
                <Heading
                  key={block.id}
                  level={block.data.level}
                  text={block.data.text}
                />
              );

            case "list":
              return (
                <ListBlock
                  key={block.id}
                  type={block.data.style}
                  items={block.data.items}
                  className="pt-3"
                />
              );

            case "code":
              return <CodeBlock key={block.id} code={block.data.code} />;

            case "table":
              return (
                <TableBlock
                  key={block.id}
                  withHeadings={block.data.withHeadings}
                  content={block.data.content}
                  className="pt-3"
                />
              );

            case "quote":
              return (
                <QuoteBlock
                  key={block.id}
                  text={block.data.text}
                  caption={block.data.caption}
                  alignment={block.data.alignment}
                  className="pt-3"
                />
              );

            case "attaches":
              return (
                <AttachesBlock
                  key={block.id}
                  title={block.data.title}
                  file={block.data.file}
                  className="pt-3"
                />
              );

            case "image":
              return (
                <ImageBlock
                  key={block.id}
                  file={block.data.file}
                  caption={block.data.caption}
                  withBorder={block.data.withBorder}
                  withBackground={block.data.withBackground}
                  stretched={block.data.stretched}
                />
              );

            case "checklist":
              return (
                <div key={block.id} className="pt-3">
                  {block.data.items.map((item, index) => (
                    <label className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="form-checkbox h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2">{parse(item.text)}</span>
                    </label>
                  ))}
                </div>
              );

            default:
              return (
                <div key={block.id} className="pt-3">
                  <p>{block.data}</p>
                </div>
              );
          }
        })}
      </div>
      <div className="mt-4 md:mt-16">
        <div className="border-b border-gray-400 py-2"></div>
        {/* <div className="flex items-center justify-between mx-4 mt-2.5 mb-1">
          <div className="inline-flex items-start gap-4 md:gap-16">
            <div className="inline-flex items-center">
              <FontAwesomeIcon icon={faThumbsUp} size="lg" />
              <span className="ml-2">{post?.likeCount}</span>
            </div>
            <div className="inline-flex items-center">
              <FontAwesomeIcon icon={faComment} size="lg" />
            </div>
          </div>
          <div className="inline-flex items-start gap-6">
            <div>
              <FontAwesomeIcon icon={faShare} size="lg" />
            </div>
            <FontAwesomeIcon icon={faBookmark} size="lg" />
            <div>
              <FontAwesomeIcon icon={faEllipsisH} size="lg" />
            </div>
          </div>
        </div> */}
        {/* <div className="border-b border-gray-400 py-2"></div> */}
      </div>
    </div>
  );
};

export default RenderEditor;

// import React, { useState, useEffect } from "react";
// import parse from "html-react-parser";
// // import PostsService from "../../services/post-service/post.service";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsUp,
//   faComment,
//   faBookmark,
//   faEllipsisH,
//   faShare,
// } from "@fortawesome/free-solid-svg-icons";

// import Heading from "./Heading";
// import CodeBlock from "./CodeBlock";
// import WarningBlock from "./WarningBlock";
// import AttachesBlock from "./AttachesBlock";
// import QuoteBlock from "./QuoteBlock";
// import TableBlock from "./TableBlock";
// import ListBlock from "./ListBlock";
// import ImageBlock from "./ImageBlock";
// import ParagraphBlock from "./ParagraphBlock";
// import DelimiterBlock from "./DelimiterBlock";

// const EditorRenderer = () => {
//   const [post, setPost] = useState();
//   const post_id = "65a1e9831228119526069b0f";
//   const fetchPost = async () => {
//     try {
//       // const response = await axios.get(
//       //   `http://localhost:3001/api/posts/read/${post_id}`
//       // );
//       const response = await PostServices.getPost(post_id);
//       setPost(response.data);
//       // console.log("this is reponse in render edito", response.data);
//       console.log("these are blocks: ",response.data?.post_content);
//     } catch (error) {
//       console.log("Internal Server error: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchPost();
//   }, []);

//   return (
//     <div className="my-8 md:my-24 px-4 md:px-12 lg:px-28 xl:px-48 font-serif">
//       <div className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-2 md:mb-8">
//         {post?.post_name}
//       </div>
// <div className="inline-flex items-center mt-3 mb-3 md:mb-6 mx-1">
//   <div className="w-10 h-10 rounded-full overflow-hidden">
//     <img
//       className="object-cover w-full h-full"
//       src={editorData.userImg}
//       alt={editorData.userName + "Profile Image"}
//     />
//   </div>
//   <div className="inline-flex items-center gap-3">
//     <div className="ml-2">{editorData.userName}</div>
//     <div className="opacity-60">{post?.cdate_time}</div>
//   </div>
// </div>
//       <div>
//         <div className="border-b border-gray-400 pt-1 pb-2"></div>
//   <div className="flex items-center justify-between mx-4 mt-2.5 mb-1">
//     <div className="inline-flex items-start gap-4 md:gap-16">
//       <div className="inline-flex items-center">
//         <FontAwesomeIcon icon={faThumbsUp} size="lg" />
//         <span className="ml-2">{post?.likeCount}</span>
//       </div>
//       <div className="inline-flex items-center">
//         <FontAwesomeIcon icon={faComment} size="lg" />
//         {/* <span className="ml-2">{post?.comments?.length || 0}</span> */}
//       </div>
//     </div>
//     <div className="inline-flex items-start gap-6">
//       <div>
//         <FontAwesomeIcon icon={faShare} size="lg" />
//       </div>
//       <FontAwesomeIcon icon={faBookmark} size="lg" />
//       <div>
//         <FontAwesomeIcon icon={faEllipsisH} size="lg" />
//       </div>
//     </div>
//   </div>
//   <div className="border-b border-gray-400 py-2"></div>
// </div>
//       <div className="mt-6 md:mt-12">
//         {post?.post_content?.blocks?.map((block) => {
//           switch (block?.type) {
//             case "paragraph":
//               return <ParagraphBlock key={block.id} text={block.data.text} />;

//             case "warning":
//               return <WarningBlock key={block.id} text={block?.data} />;

//             case "delimiter":
//               return (
//                 <DelimiterBlock key={block.id} />
//               );

//             case "header":
//               return (
//                 <Heading
//                   key={block.id}
//                   level={block.data.level}
//                   text={block.data.text}
//                 />
//               );

//             case "list":
//               return (
//                 <ListBlock
//                   key={block.id}
//                   type={block.data.style}
//                   items={block.data.items}
//                   className="pt-3"
//                 />
//               );

//             case "code":
//               return (
//                 <CodeBlock
//                   key={block.id}
//                   code={block.data.code}
//                 />
//               );

//             case "table":
//               return (
//                 <TableBlock
//                   key={block.id}
//                   withHeadings={block.data.withHeadings}
//                   content={block.data.content}
//                   className="pt-3"
//                 />
//               );

//             case "quote":
//               return (
//                 <QuoteBlock
//                   key={block.id}
//                   text={block.data.text}
//                   caption={block.data.caption}
//                   alignment={block.data.alignment}
//                   className="pt-3"
//                 />
//               );

//             case "attaches":
//               return (
//                 <AttachesBlock
//                   key={block.id}
//                   title={block.data.title}
//                   file={block.data.file}
//                   className="pt-3"
//                 />
//               );

//             case "image":
//               return (
//                 <ImageBlock
//                   key={block.id}
//                   file={block.data.file}
//                   caption={block.data.caption}
//                   withBorder={block.data.withBorder}
//                   withBackground={block.data.withBackground}
//                   stretched={block.data.stretched}
//                 />
//               );

//             case "checklist":
//               return (
//                 <div key={block.id} className="pt-3">
//                   {
//                     block.data.items.map((item, index)=>{
//                       <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={item.checked }
//                       readOnly
//                       className="form-checkbox h-4 w-4 text-indigo-600"
//                     />
//                     <span className="ml-2">{parse(item.text)}</span>
//                   </label>
//                     })
//                   }

//                 </div>
//               );

//             default:
//               return (
//                 <div key={block.id} className="pt-3">
//                   <p>{block.data}</p>
//                 </div>
//               );
//           }
//         })}
//       </div>
//       <div className="mt-4 md:mt-16">
//         <div className="border-b border-gray-400 py-2"></div>
//         <div className="flex items-center justify-between mx-4 mt-2.5 mb-1">
//           <div className="inline-flex items-start gap-4 md:gap-16">
//             <div className="inline-flex items-center">
//               <FontAwesomeIcon icon={faThumbsUp} size="lg" />
//               <span className="ml-2">{post?.likes}</span>
//             </div>
//             <div className="inline-flex items-center">
//               <FontAwesomeIcon icon={faComment} size="lg" />
//               <span className="ml-2">{post?.comments?.length || 0}</span>
//             </div>
//           </div>
//           <div className="inline-flex items-start gap-6">
//             <div>
//               <FontAwesomeIcon icon={faShare} size="lg" />
//             </div>
//             <FontAwesomeIcon icon={faBookmark} size="lg" />
//             <div>
//               <FontAwesomeIcon icon={faEllipsisH} size="lg" />
//             </div>
//           </div>
//         </div>
//         <div className="border-b border-gray-400 pt-1 pb-2"></div>
//       </div>
//     </div>
//   );
// };

// export default EditorRenderer;
