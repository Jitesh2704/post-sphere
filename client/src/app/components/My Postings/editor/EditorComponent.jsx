import React, { useEffect, useRef } from "react";
import { initEditor } from "./editorInitialiser";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PostsService from "../../../services/post-service/posts.service";
import createNotificationUtil from "../../../utils/createNotificationUtil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditorComponent = () => {
  const ejInstance = useRef(null);
  const { postId: post_id } = useParams(); // Get post_id from params
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (ejInstance.current === null) {
      console.log("Initializing EditorJS");
      ejInstance.current = initEditor();
    }
    return () => {
      console.log("Component unmounted");
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const handleClickPublish = async () => {
    if (ejInstance.current) {
      const content = await ejInstance.current.save();
      console.log("this is saved content", content.blocks);
      publishPost(content);
    }
  };

  // console.log("in the editor", post_id);

  const publishPost = async (post_content) => {
    const content = {
      is_draft: false,
      post_content,
    };
    try {
      const name = await PostsService.getPost({ post_id: post_id }, [
        "post_name",
      ]);
      const postName = name.data.post_name;
      // Use the updatePost function from PostServices
      const response = await PostsService.updatePost(post_id, content); // Use post_id
      console.log(post_content);
      console.log("Post published successfully:", response.data);
      createNotificationUtil(
        userId,
        9,
        [
          {
            username: user.username,
          },
          {
            post_name: postName,
          },
        ],
        "Creation"
      );
      toast.success("Post Published successfully");
      navigate("/kids/postings");
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  const handleClickSaveToDraft = async () => {
    if (ejInstance.current) {
      const content = await ejInstance.current.save();
      saveDraft(content);
    }
  };

  const saveDraft = async (post_content) => {
    const content = {
      is_draft: true,
      post_content,
    };
    try {
      const name = await PostsService.getPost({ post_id: post_id }, [
        "post_name",
      ]);
      const postName = name.data.post_name;
      // Use the updatePost function from PostServices
      const response = await PostsService.updatePost(post_id, content); // Use post_id
      console.log("Post saved to draft successfully:", response.data);
      createNotificationUtil(
        userId,
        10,
        [
          {
            username: user.username,
          },
          {
            post_name: postName,
          },
        ],
        "Creation"
      );
      toast.success("Post Saved to Drafts successfully");
      navigate("/kids/postings");
    } catch (error) {
      console.error("Error saving post to draft:", error.message);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-300 pb-4 md:pb-16 lg:pb-20 xl:pb-16">
      <div className="w-full pt-20 md:pt-16 px-3 md:px-16 lg:pt-20 lg:px-20 xl:pt-24 xl:px-28">
        <div
          id="editorjs"
          className="h-[70vh] bg-white shadow-lg text-md xl:text-xl rounded-xl px-3 py-3 md:py-6  md:focus-left overflow-y-auto"
        ></div>
      </div>
      <div className="w-full px-6 md:px-16 lg:px-20 xl:px-28 mt-6 px-1 flex flex-row justify-start items-start gap-4 md:gap-10">
        <button
          className="w-fit md:w-32 whitespace-nowrap  px-3 py-2 bg-blue-500 text-white font-semibold rounded-full border border-slate-400 hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-all duration-300 transform hover:scale-110"
          onClick={handleClickPublish}
        >
          Publish Now
        </button>
        <button
          className="w-fit md:w-32 whitespace-nowrap  px-3 py-2 bg-slate-200 font-semibold rounded-full border border-slate-400 hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-all duration-300 transform hover:scale-110"
          onClick={handleClickSaveToDraft}
        >
          Save to Draft
        </button>
      </div>
    </div>
  );
};

export default EditorComponent;
