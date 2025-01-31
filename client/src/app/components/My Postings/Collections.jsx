import React, { useState, useEffect } from "react";
import SmallPostTemplate from "../My Postings/templates/SmallPostTemplate";
import UserCollectionsService from "../../services/post-service/user-collections.service";
import PostsService from "../../services/post-service/posts.service";

export default function Collections({ userId }) {
  const [userCollects, setUserCollects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllCollections = async () => {
    try {
      const response = await UserCollectionsService.getAllUserCollections(
        1,
        -1,
        ["post_id", "collection_id"],
        {
          user_id: userId,
        }
      );

      const postIds = response.data.map((e) => e.post_id); // Extract post_ids
      const res = await PostsService.getAllPosts(1, -1, [], {
        post_id: postIds,
      });

      // Combine post data with matching collection_id
      const postsWithCollection = res.data.map((post) => {
        // Find the matching collection_id for the post
        const matchingCollection = response.data.find(
          (collection) => collection.post_id === post.post_id
        );
        return {
          ...post,
          collection_id: matchingCollection
            ? matchingCollection.collection_id
            : null,
        };
      });

      setUserCollects(postsWithCollection); // Set the state with posts and collection_id
    } catch (error) {
      console.error("Error fetching user collections: ", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllCollections();
  }, [userId]);

  return (
    <div className="w-full ">
      <div className="font-bold text-4xl mt-2">Your Collections</div>
      {loading ? (
        <div className="h-[60vh] flex flex-col justify-center items-center">
          <div class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
          </div>
        </div>
      ) : userCollects?.length === 0 ? (
        <div className="h-[70vh] flex flex-col justify-center items-center">
          You don't have any posts in your collections.
        </div>
      ) : (
        <div className="mt-2 mb-4 flex flex-col">
          {userCollects?.map((collection, index) => (
            <div key={index} className="my-1">
              <SmallPostTemplate
                post={collection}
                getAllCollections={getAllCollections}
              />
              {/* {index < endIndex - 1 && (
                <hr className="my-4 border-t border-gray-300" />
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
