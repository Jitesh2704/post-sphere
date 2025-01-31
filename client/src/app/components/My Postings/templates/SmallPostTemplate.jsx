import React from "react";
import { FaTimes } from "react-icons/fa";
import TimeAgo from "./TimeAgo";
import UserCollectionsService from "../../../services/post-service/user-collections.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SmallPostTemplate = ({ post, getAllCollections }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      await UserCollectionsService.deleteUserCollection(post.collection_id);
      toast.warn("Removed from Collection");
      getAllCollections();
    } catch (error) {
      console.error("Error deleting user collection:", error);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto cursor-pointer bg-gray-800 rounded-md px-3 py-2 relative">
      <div
        className="absolute top-0 right-0 cursor-pointer p-2"
        onClick={handleClick}
      >
        <FaTimes />
      </div>
      {post && (
        <>
          <div className="flex justify-start items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden mb-2">
              <img
                className="object-cover w-full h-full"
                src={
                  post.post_author.img ||
                  "https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg"
                }
                alt={`${post.post_author.name} Profile Image`}
              />
            </div>

            <div className="font-semibold text-md">{post.post_author.name}</div>
            <div className="font-semibold text-md text-gray-400">
              <TimeAgo date={post.cdate_time} />
            </div>
          </div>
          <div className="flex flex-col">
            <div
              className="font-semibold tracking-tight text-lg line-clamp-2 hover:line-clamp-none"
              onClick={() => navigate(`/view/${post.post_id}`)}
            >
              {post.post_name}
            </div>
            <div className="text-xs line-clamp-2">{post.post_short_desc}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default SmallPostTemplate;
