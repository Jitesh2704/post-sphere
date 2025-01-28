import React, { useState, useEffect } from "react";
import PostsService from "../../services/post-service/posts.service";
import { useParams } from "react-router-dom";
import UserPostsService from "../../services/post-service/user-posts.service";
import ArticlesList from "../My Postings/ArticleList";

export default function MoreFromAuthor() {
  const [author, setAuthor] = useState({});
  const [authorPosts, setAuthorPosts] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Get post details using postId
        const postDetailsResponse = await PostsService.getPost({
          post_id: postId,
        });
        const postDetails = postDetailsResponse.data;

        console.log("step1", postDetails);

        // Get the user ID who created the post
        const createdBy = postDetails.created_by;

        // Fetch all posts by the user
        const userPostsResponse = await UserPostsService.getAllUserPosts({
          user_id: createdBy,
        });

        const userPosts = userPostsResponse.data.map((post) => post.post_id);

        console.log("step2", userPosts);

        // Fetch details of all user posts
        const postDetailsPromises = userPosts.map((postId) =>
          PostsService.getPost({ post_id: postId })
        );

        const postDetailsResponses = await Promise.all(postDetailsPromises);

        console.log("step3", postDetailsResponses);

        // const userDetails = postDetailsResponses.map(
        //   (response) => response.data
        // );

        const userDetails = postDetailsResponses
          .map((response) => response.data)
          .filter((userDetail) => userDetail.is_draft === false);

        console.log(userDetails);

        setAuthor(postDetails.post_author);
        setAuthorPosts(userDetails);
      } catch (error) {
        console.error(error);
        // Handle error as needed
      }
    };
    fetchAuthorData();
  }, [postId]);

  return (
    <div className="bg-white min-h-screen">
      {/* Author Profile Section */}
      <div className="px-4 md:px-12 lg:px-28 xl:px-48 py-4 md:pb-12">
        <div className="grid grid-cols-12 ">
          <div className="order-1 md:order-1 col-span-2 md:col-span-1 p-2">
            <div className="w-12 lg:w-16 h-12 lg:h-16 rounded-full overflow-hidden ml-3 md:ml-0 mt-3 lg:mt-2 xl:mt-1.5">
              <img
                className="object-cover w-full h-full"
                src={author.img}
                alt={author.name + "Profile Image"}
              />
            </div>
          </div>
          <div className="order-3 md:order-2 col-span-12 md:col-span-9 ml-0 md:ml-3 lg:ml-6 xl:-ml-2 py-0 md:py-3">
            <div className="flex flex-col">
              <div className="flex flex-row justify-start items-start gap-2">
                <div className="font-semibold text-lg">{author.name}</div>
                <div className="text-gray-150 text-md mt-0.5">
                  {/* {authorPosts.} */}
                </div>
              </div>
              <div className="text-xs lg:text-sm">
                Author profile descriptions Tips & Career Advice for UX/Product
                Designers from a Principal Product Designer with 5+ years of
                experience
              </div>
            </div>
          </div>
          <div className="order-2 md:order-3 col-span-10 md:col-span-1 ml-28 md:ml-2 xl:ml-20 lg:ml-8 pt-6 pb-0 md:py-6">
            {/* <button className="w-28 h-10 text-lg font-semibold rounded-full bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border border-blue-500">
              Follow
            </button> */}
          </div>
        </div>
        <div className="border-b border-gray-400 py-3 md:py-6"></div>
      </div>
      {/* More from Author Section */}
      <div className="px-4 md:px-12 lg:px-28 xl:px-48 py-4">
        <div className="font-semibold text-lg md:-mt-12">
          More from {author.name}
        </div>
        <ArticlesList data={authorPosts} />
        <div className="border-b border-gray-400 py-6"></div>
      </div>
    </div>
  );
}
