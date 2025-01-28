import PostsService from "../../services/post-service/posts.service";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faClose,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ImageUploader from "../../components/ImageUploader";
import ForumService from "../../services/forum-service/forum.service";

export default function PostForm({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const navigate = useNavigate();
  const [header, setHeader] = useState("");
  const [image, setImage] = useState("");
  const [postType, setPostType] = useState("");
  const [imageSelectType, setImageSelectType] = useState("upload");
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleImageUpload = (e) => {
    setImage(e.image.storageName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create forum entry
    const forumData = {
      forum_type: "review & ratings",
      forum_name: header,
      forum_rules: [
        { rule_content: "Be respectful to others" },
        { rule_content: "No spamming" },
      ],
    };

    const forumResponse = await ForumService.createForum(forumData);
    // const post_forum_id = forumResponse.data.forum_id;
    

    const postData = {
      post_name: header,
      post_img: image,
      is_link: imageSelectType === "link", // Store whether the image is a link
      post_type: postType,
      tags,
      is_draft: true,
      post_short_desc: shortDesc,
      created_by: current_user_id,
      post_author: {
        name: user.fname + " " + user.lname,
        img: user.profile_image,
        desc: user.designation,
      },
      post_forum_id: forumResponse.data.forum_id,
    };

    try {
      const response = await PostsService.createPost(postData);
      const { post_id } = response.data;
      console.log("this is form response", response);
      window.open(`/write-a-post/${post_id}`, "_blank");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl relative">
      <div className="p-2 xl:p-16">
        <button
          className="absolute top-10 right-10 text-2xl font-gray-500"
          title="close"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div className="mt-6 w-4/5 lg:max-w-screen-md p-4 rounded-md py-10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col lg:flex-row gap-1 md:gap-4">
              <label
                htmlFor="postType"
                className="block text-sm lg:text-xl whitespace-nowrap mt-2 font-semibold text-gray-900"
              >
                Choose Type of Post:
              </label>
              <select
                id="postType"
                required
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md text-xs md:text-md focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  Choose Type of Post
                </option>
                <option value="article">Article</option>
                <option value="blog">Blog</option>
                <option value="student-stories">Student Story</option>
                <option value="books">Book</option>
                <option value="journals">Journal</option>
              </select>
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-1 md:gap-4">
              <label
                htmlFor="header"
                className="block whitespace-nowrap text-sm lg:text-xl mt-2 font-semibold text-gray-900"
              >
                Add the Topic Name:
              </label>
              <input
                type="text"
                id="header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col lg:flex-row gap-1 md:gap-4">
              <label className="block whitespace-nowrap text-sm lg:text-xl mt-2 font-semibold text-gray-900">
                Choose Image Source:
              </label>
              <div className="flex flex-col gap-6 my-3">
                <div className="flex flex-row gap-0 md:gap-2">
                  <input
                    type="radio"
                    id="upload"
                    name="imageSource"
                    value="upload"
                    checked={imageSelectType === "upload"}
                    required
                    onChange={() => setImageSelectType("upload")}
                  />
                  <div className="flex flex-col">
                    <label htmlFor="upload" className="text-xs lg:text-lg">
                      Upload from Device
                    </label>

                    {imageSelectType === "upload" && (
                      <div className="w-64 md:w-full text-xs md:text-md">
                        <ImageUploader
                          onImageUpload={handleImageUpload}
                          purpose="post-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-start items-start gap-0 md:gap-2">
                  <input
                    type="radio"
                    id="link"
                    name="imageSource"
                    value="link"
                    checked={imageSelectType === "link"}
                    onChange={() => setImageSelectType("link")}
                  />
                  <label htmlFor="link" className="text-xs lg:text-lg">
                    Paste Online Image Link
                  </label>
                  {imageSelectType === "link" && (
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="ml-3 w-48 lg:w-72 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-col lg:flex-row gap-1 md:gap-4">
              <label
                htmlFor="tags"
                className="block text-sm lg:text-xl whitespace-nowrap font-semibold text-gray-900 xl:mt-1"
              >
                Add Tags for the Post:
              </label>
              <div className="w-full flex items-center mt-1">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full md:w-10/12 p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="w-1/3 md:w-2/12 ml-2 bg-orange-400 font-semibold text-white p-2 rounded-full hover:bg-orange-500 focus:outline-none focus:shadow-outline-blue"
                >
                  Add
                </button>
              </div>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap ml-0 md:ml-56 gap-2 my-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-gray-200 px-4 py-1 rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-600 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-4 flex flex-col lg:flex-row gap-1 md:gap-4">
              <label
                htmlFor="shortDesc"
                className="block text-sm lg:text-xl whitespace-nowrap font-semibold text-gray-900"
              >
                Add Short Description:
              </label>
              <textarea
                id="shortDesc"
                value={shortDesc}
                required
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-48 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Start Writing
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                className="text-white ml-2"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
