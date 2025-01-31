import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "./TimeAgo";
import { toast } from "react-toastify";
import PostsService from "../../../services/post-service/posts.service";
import { useNavigate } from "react-router-dom";

const YourArticleTemplate = ({ data, fetchUserPosts, handleEdit }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await PostsService.deletePost(data.post_id);
      toast.success("Post marked as deleted!!");
      fetchUserPosts();
    } catch (error) {
      console.error("Error marking post as deleted:", error.message);
    }
  };

  return (
    <div className="w-full bg-gray-900 border border-gray-600 rounded-lg">
      <div className="grid grid-cols-12 gap-2 h-52">
        <div className="col-span-7 flex flex-col pl-3 py-1 w-full">
          <p
            className="font-bold tracking-tight text-xl line-clamp-1 cursor-pointer"
            onClick={() => navigate(`/view/${data.post_id}`)}
          >
            {data.post_name}
          </p>
          <p className="font-medium my-1 text-md text-blue-400">
            <TimeAgo date={data.cdate_time.toString()} />
          </p>
          <p className="tracking-tighter line-clamp-5 text-sm ">
            {data.post_short_desc}
          </p>
          <div className="flex flex-row gap-3 mt-2">
            <button
              class="w-20 text-sm py-1 px-2 shadow-lg font-medium rounded-md bg-red-600"
              onClick={handleDelete}
            >
              <FontAwesomeIcon className="mr-1.5" icon={faTrashAlt} />
              Delete
            </button>

            <button
              class="w-20 text-sm py-1 px-2 shadow-lg font-medium rounded-md bg-blue-600"
              onClick={() => handleEdit(data.post_id)}
            >
              <FontAwesomeIcon className="mr-1.5" icon={faEdit} />
              Edit
            </button>
          </div>
        </div>
        <div className="col-span-5 h-52">
          <div className="h-52 overflow-hidden">
            <img
              className="object-cover h-full rounded-r-lg w-full"
              src={data.post_img}
              alt="Post Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourArticleTemplate;
