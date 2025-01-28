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
import PostsService from "../../../services/post-service/posts.service";
import AuthService from "../../../services/auth-service/auth.service";
import TimeAgo from "../templates/TimeAgo";
import { useParams } from "react-router-dom";
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

const RenderEditor = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [authorProfileImage, setAuthorProfileImage] = useState(null);

  // const handleShareClick = () => {
  //   // Get the current URL
  //   const currentUrl = window.location.href;

  //   // Copy the URL to the clipboard
  //   navigator.clipboard
  //     .writeText(currentUrl)
  //     .then(() => {
  //       alert("Link copied to clipboard!");
  //     })
  //     .catch((error) => {
  //       console.error("Failed to copy:", error);
  //     });
  // };

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


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostsService.getPost({ post_id: postId });
        setPost(response.data);

        // Fetch author profile image
        const authorId = response.data.created_by; // Assuming post_author has an id field
        const authorProfile = await AuthService.getAuthUser({
          user_id: authorId,
        });
        setAuthorProfileImage(authorProfile.data.profile_image);
      } catch (error) {
        console.log("Internal Server error: ", error);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 md:mt-24 px-4 md:px-12 lg:px-28 xl:px-48">
      <div className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-2 md:mb-8">
        {post.post_name}
      </div>
      <div className="inline-flex items-center mt-3 mb-3 md:mb-6 mx-1">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {authorProfileImage && (
            <img src={authorProfileImage} alt="Author Profile" />
          )}
        </div>
        <div className="inline-flex items-center gap-3">
          <div className="ml-2">{post.post_author.name}</div>
          <TimeAgo date={post.cdate_time} />
        </div>
      </div>
      <div>
        <div className="border-b border-gray-400 pt-1 pb-2"></div>
        <div className="flex items-center justify-between mx-4 mt-2.5 mb-1">
          <div className="inline-flex items-start gap-4 md:gap-16">
            <div className="inline-flex items-center">
              <FontAwesomeIcon icon={faThumbsUp} size="lg" />
              <span className="ml-4 text-lg">{post?.like_count}</span>
            </div>
            {/* <div className="inline-flex items-center">
              <FontAwesomeIcon icon={faComment} size="lg" />
            </div> */}
          </div>
          <div className="inline-flex items-start gap-6">
            <button className="flex flex-row gap-3 text-blue-500" onClick={handleShareClick}>
              <div className="text-lg">Share the Post</div>
              <FontAwesomeIcon icon={faShare} size="lg" className="mt-1 ml-1" />
            </button>
            {/* <FontAwesomeIcon icon={faBookmark} size="lg" /> */}
            <div>{/* <FontAwesomeIcon icon={faEllipsisH} size="lg" /> */}</div>
          </div>
        </div>
        <div className="border-b border-gray-400 py-2"></div>
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
