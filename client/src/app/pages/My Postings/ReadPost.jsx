import React, { useState, useEffect } from "react";
import EditorRenderer from "../../components/My Postings/editor/RenderEditor";
import MoreFromAuthor from "../../components/My Postings/MoreFromAuthor";
import Forum from "../../components/forum/Forum";
import { useParams } from "react-router-dom";
import PostsService from "../../services/post-service/posts.service";

export default function ReadPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null); // State to hold post data

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await PostsService.getPost({ post_id: postId });
         console.log("in read view", postData);
        setPost(postData.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost(); // Call fetchPost when component mounts
  }, [postId]); // Fetch post whenever postId changes

  return (
    <div className="flex flex-col">
      <EditorRenderer postId={postId} />
      <MoreFromAuthor userId={postId} />
      <div className="bg-neutral-100 xl:my-10 xl:mx-44 border border-gray-300 p-6 rounded-lg shadow-xl">
        <div className="mb-6 text-3xl font-semibold">
          Ratings & Discussion:
        </div>
        {post && post.post_forum_id && <Forum forum_id={post.post_forum_id} />}
      </div>
    </div>
  );
}

// import React from "react";
// import EditorRenderer from "../../components/My Postings/editor/RenderEditor";
// import MoreFromAuthor from "../../components/My Postings/MoreFromAuthor";
// import Forum from "../../components/forum/Forum"
// import { useParams } from "react-router-dom";

// export default function ReadPost() {
//   const { postId } = useParams();

//   return (
//     <div className="flex flex-col">
//       <EditorRenderer postId={postId} />
//       <MoreFromAuthor userId={postId} />
//       <Forum />
//     </div>
//   );
// }
