// PostEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { initEditor } from "../../components/My Postings/editor/postEditModeIntitialiser";
import { useParams, useNavigate } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import createNotificationUtil from "../../utils/createNotificationUtil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PostEditor = () => {
  const ejInstance = useRef();
  const { postId: post_id } = useParams(); // Get post_id from params
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const userId = user?.user_id;

  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        const response = await PostsService.getPost({ post_id: post_id });
        if (response.data) {
          setPostContent(response.data.post_content);
        } else {
          console.error("Error fetching post content: Response data is empty");
        }
      } catch (error) {
        console.error("Error fetching post content:", error.message);
      }
    };

    if (!postContent && post_id) {
      // Only fetch if postContent is not set and post_id exists
      fetchPostContent();
    }
  }, [post_id, postContent]); // Add postContent as a dependency

  useEffect(() => {
    if (postContent && ejInstance.current === null) {
      ejInstance.current = initEditor(postContent); // Initialize editor with post content
    }

    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        console.log("Destroying editor instance:", ejInstance.current);
        ejInstance.current.destroy();
      }
      ejInstance.current = null;
    };
  }, [postContent]);

  const handleClickPublish = async () => {
    if (ejInstance.current) {
      const content = await ejInstance.current.save();
      updatePost(content, false);
    }
  };

  const handleClickSaveToDraft = async () => {
    if (ejInstance.current) {
      const content = await ejInstance.current.save();
      updatePost(content, true);
    }
  };

  const updatePost = async (postContent, is_draft) => {
    const content = {
      is_draft,
      post_content: postContent,
    };
    try {
      const response = await PostsService.updatePost(post_id, content); // Use post_id
      if (is_draft) {
        console.log("Post saved to draft successfully:", response.data);
        createNotificationUtil(
          userId,
          8,
          [
            {
              username: user.username,
            },
            {
              post_name: postContent.post_name,
            },
          ],
          "Updation"
        );
        toast.success("Draft updated successfully");
      } else {
        console.log("Post published successfully:", response.data);
        createNotificationUtil(
          userId,
          7,
          [
            {
              username: user.username,
            },
            {
              post_name: postContent.post_name,
            },
          ],
          "Updation"
        );
        toast.success("Post Updated successfully");
      }
      navigate("/kids/postings");
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  return (
    <div className="h-screen bg-slate-100 pb-4 md:pb-16 lg:pb-20 xl:pb-16">
      <div className="pt-4 md:pt-16 px-3 md:px-16 lg:pt-20 lg:px-20 xl:pt-24 xl:px-28">
        <div
          id="editorjs"
          className="h-[70vh] bg-white shadow-lg text-md xl:text-xl rounded-xl py-6 px-3 focus-left overflow-y-auto"
        ></div>
      </div>
      <div className="px-3 flex flex-row justify-start items-start gap-4 md:gap-10">
        <button
          className="w-32 whitespace-nowrap mt-6 px-3 py-2 bg-blue-500 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
          onClick={handleClickPublish}
        >
          Publish Now
        </button>
        <button
          className="w-32 whitespace-nowrap mt-6 px-3 py-2 bg-slate-200 font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
          onClick={handleClickSaveToDraft}
        >
          Save to Draft
        </button>
      </div>
    </div>
  );
};

export default PostEditor;

// import React, { useEffect, useRef, useState } from "react";
// import { initEditor } from "../../components/My Postings/editor/postEditModeIntitialiser";
// import { useParams, useNavigate } from "react-router-dom";
// import PostsService from "../../services/post-service/posts.service";

// const PostEditor = () => {
//   const ejInstance = useRef();
//   const { postId: post_id } = useParams(); // Get post_id from params
//   const navigate = useNavigate();
//   const [postContent, setPostContent] = useState(null);

//   useEffect(() => {
//     const fetchPostContent = async () => {
//       try {
//         const response = await PostsService.getPost({ post_id: post_id });
//         if (response.data) {
//           setPostContent(response.data.post_content);
//         } else {
//           console.error("Error fetching post content: Response data is empty");
//         }
//       } catch (error) {
//         console.error("Error fetching post content:", error.message);
//       }
//     };

//     fetchPostContent();
//   }, [post_id]);

//   useEffect(() => {
//     if (postContent && ejInstance.current === null) {
//       ejInstance.current = initEditor(postContent); // Initialize editor with post content
//     }

//     return () => {
//       ejInstance?.current?.destroy();
//       ejInstance.current = null;
//     };
//   }, [postContent]);

//   const handleClickPublish = async () => {
//     if (ejInstance.current) {
//       const content = await ejInstance.current.save();
//       updatePost(content, false);
//     }
//   };

//   const handleClickSaveToDraft = async () => {
//     if (ejInstance.current) {
//       const content = await ejInstance.current.save();
//       updatePost(content, true);
//     }
//   };

//   const updatePost = async (postContent, is_draft) => {
//     const content = {
//       is_draft,
//       post_content: postContent,
//     };
//     try {
//       const response = await PostsService.updatePost(post_id, content); // Use post_id
//       if (is_draft) {
//         console.log("Post saved to draft successfully:", response.data);
//       } else {
//         console.log("Post published successfully:", response.data);
//       }
//       navigate("/postings");
//     } catch (error) {
//       console.error("Error updating post:", error.message);
//     }
//   };

//   return (
//     <div className="bg-slate-100 pb-4 md:pb-16 lg:pb-20 xl:pb-16">
//       <div className="pt-4 md:pt-16 px-3 md:px-16 lg:pt-20 lg:px-20 xl:pt-24 xl:px-28">
//         <div
//           id="editorjs"
//           className="h-[70vh] shadow-lg text-md xl:text-xl rounded-2xl py-6 px-16 focus-left overflow-y-auto"
//         ></div>
//       </div>
//       <div className="flex">
//         <button
//           className="ml-28 w-32 whitespace-nowrap mt-6 px-3 py-2 bg-blue-500 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
//           onClick={handleClickPublish}
//         >
//           Publish Now
//         </button>
//         <button
//           className="ml-10 w-32 whitespace-nowrap mt-6 px-3 py-2 bg-slate-200 font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
//           onClick={handleClickSaveToDraft}
//         >
//           Save to Draft
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostEditor;

// import React, { useEffect, useRef, useState } from "react";
// import { initEditor } from "../../components/My Postings/editor/postEditModeIntitialiser";
// import { useParams, useNavigate } from "react-router-dom";
// import PostsService from "../../services/post-service/posts.service";

// const PostEditor = () => {
//   const ejInstance = useRef();
//   const { postId: post_id } = useParams(); // Get post_id from params
//   const navigate = useNavigate();
//   const [postContent, setPostContent] = useState(null);

//   useEffect(() => {
//     const fetchPostContent = async () => {
//       try {
//         const response = await PostsService.getPost({post_id: post_id});
//         if (response.data) {
//            console.log(response.data.post_content);
//           setPostContent(response.data.post_content);
//         } else {
//           console.error("Error fetching post content: Response data is empty");
//         }
//       } catch (error) {
//         console.error("Error fetching post content:", error.message);
//       }
//     };

//     fetchPostContent();

//    if (ejInstance.current === null && postContent !== null) {
//      ejInstance.current = initEditor(postContent); // Initialize editor with post content
//    }

//     return () => {
//       ejInstance?.current?.destroy();
//       ejInstance.current = null;
//     };
//   }, [post_id]);

//   const handleClickPublish = async () => {
//     if (ejInstance.current) {
//       const content = await ejInstance.current.save();
//       updatePost(content, false);
//     }
//   };

//   const handleClickSaveToDraft = async () => {
//     if (ejInstance.current) {
//       const content = await ejInstance.current.save();
//       updatePost(content, true);
//     }
//   };

//   const updatePost = async (postContent, is_draft) => {
//     const content = {
//       is_draft,
//       post_content: postContent,
//     };
//     try {
//       const response = await PostsService.updatePost(post_id, content); // Use post_id
//       if (is_draft) {
//         console.log("Post saved to draft successfully:", response.data);
//       } else {
//         console.log("Post published successfully:", response.data);
//       }
//       navigate("/postings");
//     } catch (error) {
//       console.error("Error updating post:", error.message);
//     }
//   };

//   return (
//     <div className="bg-slate-100 pb-4 md:pb-16 lg:pb-20 xl:pb-16">
//       <div className="pt-4 md:pt-16 px-3 md:px-16 lg:pt-20 lg:px-20 xl:pt-24 xl:px-28">
//         <div
//           id="editorjs"
//           className="h-[70vh] shadow-lg text-md xl:text-xl rounded-2xl py-6 px-16 focus-left overflow-y-auto"
//         ></div>
//       </div>
//       <div className="flex">
//         <button
//           className="ml-28 w-32 whitespace-nowrap mt-6 px-3 py-2 bg-blue-500 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
//           onClick={handleClickPublish}
//         >
//           Publish Now
//         </button>
//         <button
//           className="ml-10 w-32 whitespace-nowrap mt-6 px-3 py-2 bg-slate-200 font-semibold rounded-full border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500"
//           onClick={handleClickSaveToDraft}
//         >
//           Save to Draft
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostEditor;
