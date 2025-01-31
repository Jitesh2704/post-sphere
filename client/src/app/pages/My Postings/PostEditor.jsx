import React, { useEffect, useRef, useState } from "react";
import { initEditor } from "../../components/My Postings/editor/postEditModeIntitialiser";
import { useParams, useNavigate } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const PostEditor = () => {
  const ejInstance = useRef();
  const { postId: post_id } = useParams();
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState(null);

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
      fetchPostContent();
    }
  }, [post_id, postContent]);

  useEffect(() => {
    if (postContent && ejInstance.current === null) {
      ejInstance.current = initEditor(postContent);
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
      const response = await PostsService.updatePost(post_id, content);
      if (is_draft) {
        console.log("Post saved to draft successfully:", response.data);
        toast.success("Draft updated successfully");
      } else {
        console.log("Post published successfully:", response.data);
        toast.success("Post Updated successfully");
      }
      navigate("/home");
    } catch (error) {
      console.error("Error updating post:", error.message);
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

export default PostEditor;
