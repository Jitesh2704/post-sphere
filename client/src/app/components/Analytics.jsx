import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostsService from "../services/post-service/posts.service";
import ForumThreadService from "../services/forum-service/forum-thread.service";
import UserCollectionsService from "../services/post-service/user-collections.service";
import PostLikesService from "../services/post-service/post-likes.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCircleCheck,
  faClock,
  faComment,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FaFirstdraft } from "react-icons/fa";

export default function Analytics() {
  const [likeCount, setLikeCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [publishCount, setPublishCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.user_id) return; // Prevent execution if user is not available

    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          PostLikesService.getAllPostLikes(1, -1, ["post_like_id"], {
            user_id: user.user_id,
            is_liked: true,
          }),
          UserCollectionsService.getAllUserCollections(
            1,
            -1,
            ["collection_id"],
            {
              user_id: user.user_id,
            }
          ),
          PostsService.getAllPosts(1, -1, ["is_draft", "post_id"], {
            created_by: user.user_id,
          }),
          ForumThreadService.getAllForumThreads(1, -1, ["thread_id"], {
            created_by: user.user_id,
          }),
        ]);

        // Extract Data Safely
        const likes =
          results[0].status === "fulfilled" ? results[0].value.data || [] : [];
        const collections =
          results[1].status === "fulfilled" ? results[1].value.data || [] : [];
        const posts =
          results[2].status === "fulfilled" ? results[2].value.data || [] : [];
        const threads =
          results[3].status === "fulfilled" ? results[3].value.data || [] : [];

        // Update State
        setLikeCount(likes.length);
        setCollectionCount(collections.length);
        setDraftCount(posts.filter((e) => e.is_draft === true).length);
        setPublishCount(posts.filter((e) => e.is_draft === false).length);
        setCommentCount(threads.length);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchData();
  }, [user?.user_id]);

  return (
    <div className="p-3 bg-slate-900 border-2 border-gray-600 rounded-xl w-full shadow-md">
      <div className="font-bold text-xs md:text-lg lg:text-xl text-center border-b pb-2 border-gray-600">
        Dashboard & Analytics
      </div>
      <div className="grid grid-cols-12 text-sm text-gray-500">
        <div className="flex-row items-center font-medium text-gray-400 col-span-7 border-gray-600 border-b py-2 flex justify-start">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-blue-500 mr-1.5 pl-3"
          />{" "}
          Published Posts :
        </div>
        <div className="pr-3 col-span-5 border-gray-600 border-b py-2 flex justify-end font-medium text-gray-500 whitespace-nowrap">
          {publishCount}
        </div>
        <div className="flex-row items-center font-medium text-gray-400 col-span-7 border-gray-600 border-b py-2 flex justify-start">
          <FontAwesomeIcon
            icon={faClock}
            className="text-blue-500 mr-1.5 pl-3"
          />{" "}
          Drafted Posts :
        </div>
        <div className="pr-3 col-span-5 border-gray-600 border-b py-2 flex justify-end font-medium text-gray-500 whitespace-nowrap">
          {draftCount}
        </div>
        <div className="flex-row items-center font-medium text-gray-400 col-span-7 border-gray-600 border-b py-2 flex justify-start">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className="text-blue-500 mr-1.5 pl-3"
          />{" "}
          Liked Posts :
        </div>
        <div className="pr-3 col-span-5 border-gray-600 border-b py-2 flex justify-end font-medium text-gray-500 whitespace-nowrap">
          {likeCount}
        </div>

        <div className="flex-row items-center font-medium text-gray-400 col-span-7 border-gray-600 border-b py-2 flex justify-start">
          <FontAwesomeIcon
            icon={faBookmark}
            className="text-blue-500 mr-1.5 pl-3"
          />{" "}
          Bookmarks :
        </div>
        <div className="pr-3 col-span-5 border-gray-600 border-b py-2 flex justify-end font-medium text-gray-500 whitespace-nowrap">
          {collectionCount}
        </div>

        <div className="flex-row items-center font-medium text-gray-400 col-span-7 border-gray-600 border-b py-2 flex justify-start">
          <FontAwesomeIcon
            icon={faComment}
            className="text-blue-500 mr-1.5 pl-3"
          />{" "}
          Total Comments :
        </div>
        <div className="pr-3 col-span-5 border-gray-600 border-b py-2 flex justify-end font-medium text-gray-500 whitespace-nowrap">
          {commentCount}
        </div>
      </div>
    </div>
  );
}
