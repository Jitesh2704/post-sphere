import React, { useEffect, useRef } from "react";
import { initEditor } from "./editorInitialiser";
import { useParams, useNavigate } from "react-router-dom";
import PostsService from "../../../services/post-service/posts.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../NavBar";
import Footer from "../../Footer";

const EditorComponent = () => {
  const ejInstance = useRef(null);
  const { postId: post_id } = useParams();
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

  const publishPost = async (post_content) => {
    const content = {
      is_draft: false,
      post_content,
    };
    try {
      const response = await PostsService.updatePost(post_id, content);
      console.log("Post published successfully:", response.data);
      toast.success("Post Published successfully");
      navigate("/home");
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
      const response = await PostsService.updatePost(post_id, content);
      console.log("Post saved to draft successfully:", response.data);
      toast.success("Post Saved to Drafts successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error saving post to draft:", error.message);
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>
      <div className="w-full px-10 pt-24 text-black pb-3">
        <div
          id="editorjs"
          className="h-[70vh] bg-white shadow-lg text-md rounded-3xl p-4 overflow-y-auto border-8 border-gray-400"
        ></div>
      </div>
      <div className="w-full px-10 flex flex-row justify-start items-center gap-3">
        <button
          className="w-fit md:w-32 whitespace-nowrap px-3 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-white hover:text-blue-600 hover:border-2 hover:border-blue-600 transition-all duration-300 hover:scale-110"
          onClick={handleClickPublish}
        >
          Publish Now
        </button>
        <button
          className="w-fit md:w-32 whitespace-nowrap px-3 py-2 bg-slate-600 font-bold rounded-full border-2 border-slate-400 hover:bg-slate-200 hover:text-slate-500 hover:border-slate-500 transition-all duration-300 hover:scale-110"
          onClick={handleClickSaveToDraft}
        >
          Save to Draft
        </button>
      </div>
      <div className="absolute bottom-0 right-0 left-0">
        <Footer />
      </div>
    </div>
  );
};

export default EditorComponent;
