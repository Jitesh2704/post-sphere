import React, { useState, useEffect, useRef } from "react";
import EditorRenderer from "../../components/My Postings/editor/RenderEditor";
import MoreFromAuthor from "../../components/My Postings/MoreFromAuthor";
import { useParams } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import RubicsLoader from "../../components/My Postings/templates/RubicsLoader";
import Forum from "../../components/forum/Forum";

export default function ReadPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const commentsSectionRef = useRef(null); // Reference to the comments section

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await PostsService.getPost({ post_id: postId });
        console.log("in read view", postData.data);
        setPost(postData.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <RubicsLoader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Post not found.</p>
      </div>
    );
  }

  const scrollToComments = () => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scroll
        block: "start", // Scroll to the top of the element
      });
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#131520]">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>
      <div className="flex flex-col pt-24">
        <EditorRenderer data={post} scrollToComments={scrollToComments}/>
        <MoreFromAuthor userId={post?.created_by} />
        <div className="px-20 pb-16 bg-[#131520]" ref={commentsSectionRef}>
          <div className="my-6 text-3xl font-semibold">Comments:</div>
          {post && post.post_forum_id && (
            <Forum forum_id={post.post_forum_id} />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 left-0">
        <Footer />
      </div>
    </div>
  );
}
