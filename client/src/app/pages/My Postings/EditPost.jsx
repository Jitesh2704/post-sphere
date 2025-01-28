import PostsService from "../../services/post-service/posts.service";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import NewNavigationBar from "../../components/NewNavigationBar";
import Footer from "../../components/Footer";
import ImageUploader from "../../components/ImageUploader";

export default function EditPost() {
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const { postId } = useParams();
  const navigate = useNavigate();
  const [header, setHeader] = useState("");
  const [image, setImage] = useState("");
  const [postType, setPostType] = useState("");
  const [imageSelectType, setImageSelectType] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isLink, setIsLink] = useState("");

  const fillData = async () => {
    try {
      const response = await PostsService.getPost({ post_id: postId });
      const post = response.data;
      if (post) {
        setHeader(post.post_name);
        setImage(post.post_img);
        setShortDesc(post.post_short_desc);
        setPostType(post.post_type);
        setTags(post.tags);
        setIsLink(post.is_link);
        setImageSelectType(post.is_link ? "link" : "upload");
        setCreatedBy(post.created_by); // Set createdBy from post data
      }
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  useEffect(() => {
    fillData();
  }, [postId]);

  const handleImageUpload = (e) => {
    setImage(e.image.storageName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      post_name: header,
      post_img: image,
      post_type: postType,
      is_link: imageSelectType === "link",
      tags,
      post_short_desc: shortDesc,
    };

    try {
      const response = await PostsService.updatePost(postId, postData);
      console.log("Post Details edited successfully:", response.data);
      navigate(`/edit-post/${postId}`);
    } catch (error) {
      console.error("Error editing post:", error.message);
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
    <>
      {/* <div className="-mt-12">
        <NewNavigationBar />
      </div> */}
      <div className="mb-20 mt-20">
        <div className="max-w-screen-md mx-4 md:mx-8 lg:mx-auto  xl:mt-0 rounded-2xl border border-gray-300 p-4 md:p-8">
          <h1 className="my-4">Edit Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col md:flex-row gap-1 md:gap-4">
              <label
                htmlFor="postType"
                className="block text-sm md:text-xl whitespace-nowrap mt-2 font-semibold text-gray-900"
              >
                Choose Type of Post:
              </label>
              <select
                id="postType"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
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
                className="block whitespace-nowrap text-sm md:text-xl mt-2 font-semibold text-gray-900"
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
            <div className="mb-4 flex flex-col md:flex-row gap-1 md:gap-4">
              <label className="block text-sm md:text-xl mt-2 font-semibold text-gray-900">
                Choose Image Source: <br />
                <span className="text-xs text-gray-400 font-light">
                  Change only if you want to change the existing image***
                </span>
              </label>
              <div className="flex flex-col gap-6 my-3">
                <div className="flex flex-col md:flex-row gap-0 md:gap-2">
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
                    <label htmlFor="upload" className="text-xs md:text-lg">
                      Upload from Device
                    </label>
                    {imageSelectType === "upload" && (
                      // <input
                      //   type="file"
                      //   accept="image/*"
                      //   onChange={(e) =>
                      //     setImage(URL.createObjectURL(e.target.files[0]))
                      //   }
                      //   className="ml-3"
                      // />
                      <ImageUploader
                        onImageUpload={handleImageUpload}
                        purpose="post-image"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-0 md:gap-2">
                  <input
                    type="radio"
                    id="link"
                    name="imageSource"
                    value="link"
                    checked={imageSelectType === "link"}
                    onChange={() => setImageSelectType("link")}
                  />
                  <label htmlFor="link" className="text-xs md:text-lg">
                    Paste Online Image Link
                  </label>
                  {imageSelectType === "link" && (
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="ml-3 w-72 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-1 md:gap-4">
              <label
                htmlFor="tags"
                className="block text-sm md:text-xl whitespace-nowrap font-semibold text-gray-900 xl:mt-1"
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
            <div className="mb-4 flex flex-col md:flex-row gap-1 md:gap-4">
              <label
                htmlFor="shortDesc"
                className="block text-sm md:text-xl whitespace-nowrap font-semibold text-gray-900"
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
              Save Edits
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                className="text-white ml-2"
              />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
