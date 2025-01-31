import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";
import PostsService from "../../services/post-service/posts.service";
import ForumService from "../../services/forum-service/forum.service";

export default function PostForm({ onClose, postId }) {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    post_name: "",
    post_type: "",
    post_img: "",
    is_link: true,
    post_short_desc: "",
    tags: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        try {
          const res = await PostsService.getPost({ post_id: postId }, []);
          setFormData(res.data);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      }
    };
    fetchData();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (newTags) => {
    setFormData({ ...formData, tags: newTags.map((tag) => tag.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (postId) {
        await PostsService.updatePost(postId, formData);
        window.open(`/edit-content/${postId}`, "_blank");
      } else {
        const forumData = {
          forum_type: "review & ratings",
          forum_name: formData.post_name,
          forum_rules: [
            { rule_content: "Be respectful to others" },
            { rule_content: "No spamming" },
          ],
        };
        const forumResponse = await ForumService.createForum(forumData);
        const postData = {
          ...formData,
          post_forum_id: forumResponse.data.forum_id,
          is_draft: true,
          post_content: {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: " ",
                },
              },
            ],
          },
          post_author: {
            name: `${user.fname} ${user.lname}`,
            // img: user.profile_image,
          },
        };
        const response = await PostsService.createPost(postData);
        window.open(`/editor/${response.data.post_id}`, "_blank");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
      <div className="bg-gray-50 p-10 border w-7/12 rounded-lg relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="cursor-pointer text-black text-2xl absolute top-6 right-6"
          onClick={onClose}
        />
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl text-blue-600 font-semibold italic mb-4">
            <span className="text-gray-800 mr-1">Step 1:</span> Fill the
            Metadata to Unlock the Editor & Start Crafting your Post.
          </h2>
          <label className="block text-gray-900 font-medium text-md">
            Select the type of Post:
          </label>
          <select
            name="post_type"
            value={formData.post_type}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 text-black placeholder:text-gray-500 bg-slate-200"
          >
            <option value="" disabled>
              Select Post Type
            </option>
            <option value="article">Article</option>
            <option value="blog">Blog</option>
            <option value="story">Story</option>
            <option value="review">Review</option>
            <option value="editorial">Editorial</option>
          </select>
          <label className="block text-gray-900 font-medium text-md mt-2">
            Add the Topic Name:
          </label>
          <input
            type="text"
            name="post_name"
            value={formData.post_name}
            onChange={handleChange}
            required
            placeholder="Enter Post Title"
            className="w-full p-2 text-black mt-1 placeholder:text-gray-500 bg-slate-200"
          />
          <label className="block text-gray-900 font-medium text-md mt-2">
            Enter Post Cover Image Link:
          </label>
          <input
            type="text"
            name="post_img"
            value={formData.post_img}
            onChange={handleChange}
            required
            placeholder="Enter Online Image Link"
            className="w-full p-2 text-black mt-1 placeholder:text-gray-500 bg-slate-200"
          />
          <label className="block text-gray-900 font-medium text-md mt-2">
            Add Short Description:
          </label>
          <textarea
            name="post_short_desc"
            value={formData.post_short_desc}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Provide a crisp post description..."
            className="w-full p-2 placeholder:text-gray-500 mt-1 bg-slate-200 text-black"
          ></textarea>
          <label className="block text-gray-900 font-medium text-md mt-1">
            Add Tags for the Post:
          </label>
          <CreatableSelect
            isMulti
            value={formData.tags.map((tag) => ({ label: tag, value: tag }))}
            onChange={handleTagChange}
            className="w-full mt-1"
            placeholder="Enter a tag and hit enter"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 mt-6 hover:bg-blue-600"
          >
            {postId ? "Update" : "Save"} Metadata & Proceed to Editor{" "}
            <FontAwesomeIcon icon={faChevronCircleRight} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}

// import PostsService from "../../services/post-service/posts.service";
// import ForumService from "../../services/forum-service/forum.service";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faChevronCircleRight,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
// import CreatableSelect from "react-select/creatable";

// export default function PostForm({ onClose, postId }) {
//   const { user } = useSelector((state) => state.auth);
//   const [formData, setFormData] = useState({
//     post_name: "",
//     post_type: "",
//     post_img: "",
//     is_link: true,
//     post_short_desc: "",
//     tags: [],
//   });

//   const fillData = async () => {
//     try {
//       if(postId) {
//  const res = await PostsService.getPost({ post_id: postId }, []);
//  setFormData(res.data);
//       }

//     } catch (error) {

//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleTagChange = (newTags) => {
//     setFormData({ ...formData, tags: newTags.map((tag) => tag.value) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const forumData = {
//       forum_type: "review & ratings",
//       forum_name: formData.post_name,
//       forum_rules: [
//         { rule_content: "Be respectful to others" },
//         { rule_content: "No spamming" },
//       ],
//     };

//     if(postId){
//         const result = await PostsService.updatePost(postId, formData);
//         window.open(`/editor/${postId}`, "_blank");
//       onClose();
//       setFormData({
//         post_name: "",
//         post_type: "",
//         post_img: "",
//         is_link: true,
//         post_short_desc: "",
//         tags: [],
//       });
//     } else {
//  try {
//       const forumResponse = await ForumService.createForum(forumData);

//       const postData = {
//         ...formData,
//         post_forum_id: forumResponse.data.forum_id,
//         is_draft: true,
//         post_author: {
//           name: `${user.fname} ${user.lname}`,
//           img: user.profile_image,
//         },
//       };

//       const response = await PostsService.createPost(postData);
//       window.open(`/editor/${response.data.post_id}`, "_blank");
//       onClose();
//       setFormData({
//         post_name: "",
//         post_type: "",
//         post_img: "",
//         is_link: true,
//         post_short_desc: "",
//         tags: [],
//       });
//     } catch (error) {
//       console.error("Error creating post:", error.message);
//     }
//     }

//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
//       <div className="bg-gray-50 p-10 border w-7/12 rounded-lg relative">
//         <FontAwesomeIcon
//           icon={faTimes}
//           className="cursor-pointer text-black text-2xl absolute top-6 right-6"
//           onClick={onClose}
//         />
//         <form onSubmit={handleSubmit} className="">
//           <h2 className="text-2xl text-blue-600 font-semibold italic mb-4">
//             <span className="text-gray-800 mr-1">Step 1:</span>Fill the Metadata
//             to Unlock the Editor & Start Crafting your Post.
//           </h2>
//           <label className="block text-gray-900 font-medium text-md">
//             Select the type of Post:
//           </label>
//           <select
//             name="post_type"
//             value={formData.post_type}
//             onChange={handleChange}
//             required
//             className="w-full p-2 mt-1 text-black placeholder:text-gray-500 bg-slate-200"
//           >
//             <option value="" disabled>
//               Select Post Type
//             </option>
//             <option value="article">Article</option>
//             <option value="blog">Blog</option>
//             <option value="story">Story</option>
//             <option value="review">Review</option>
//             <option value="editorial">Editorial</option>
//           </select>

//           <label className="block text-gray-900 font-medium text-md mt-2">
//             Add the Topic Name:
//           </label>
//           <input
//             type="text"
//             name="post_name"
//             value={formData.post_name}
//             onChange={handleChange}
//             required
//             placeholder="Enter Post Title"
//             className="w-full p-2 text-black mt-1 placeholder:text-gray-500 bg-slate-200"
//           />

//           <label className="block text-gray-900 font-medium text-md mt-2">
//             Enter Post Cover Image Link:
//           </label>
//           <input
//             type="text"
//             name="post_img"
//             value={formData.post_img}
//             onChange={handleChange}
//             required
//             placeholder="Enter Online Image Link"
//             className="w-full p-2 text-black mt-1 placeholder:text-gray-500 bg-slate-200"
//           />

//           <label className="block text-gray-900 font-medium text-md mt-2">
//             Add Short Description:
//           </label>
//           <textarea
//             name="post_short_desc"
//             value={formData.post_short_desc}
//             onChange={handleChange}
//             required
//             rows={"2"}
//             placeholder="Provide a crisp post description..."
//             className="w-full p-2 placeholder:text-gray-500 mt-1 bg-slate-200 text-black"
//           ></textarea>

//           <label className="block text-gray-900 font-medium text-md mt-1">
//             Add Tags for the Post:
//           </label>
//           <CreatableSelect
//             isMulti
//             value={formData.tags.map((tag) => ({ label: tag, value: tag }))}
//             onChange={handleTagChange}
//             className="w-full mt-1"
//             placeholder="Enter a tag and hit enter"
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-3 mt-6 hover:bg-blue-600"
//           >
//             Save Metadata & Proceed to Editor
//             <FontAwesomeIcon icon={faChevronCircleRight} className="ml-2" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
