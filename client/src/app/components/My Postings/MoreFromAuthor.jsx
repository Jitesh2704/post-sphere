import React, { useState, useEffect } from "react";
import PostsService from "../../services/post-service/posts.service";
import { useParams } from "react-router-dom";
import UserPostsService from "../../services/post-service/user-posts.service";
import ArticlesList from "../My Postings/ArticleList";

export default function MoreFromAuthor({ userId }) {
  const [author, setAuthor] = useState({});
  const [authorPosts, setAuthorPosts] = useState([]);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const res = await PostsService.getAllPosts(1, 12, [], {
          created_by: userId,
        });

        setAuthor(res.data[0].post_author);
        setAuthorPosts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthorData();
  }, [userId]);

  return (
    <div className="px-20 bg-[#131520]">
      <div className="">
        <div className="grid grid-cols-12 ">
          <div className="order-1 md:order-1 col-span-2 md:col-span-1 p-2">
            <div className="w-12 lg:w-20 h-12 lg:h-20 rounded-full overflow-hidden ml-3 md:ml-0 mt-3 lg:mt-2 xl:mt-1.5">
              <img
                className="object-cover w-full h-full"
                src={
                  author.img ||
                  "https://i.pinimg.com/736x/21/20/b0/2120b058cb9946e36306778243eadae5.jpg"
                }
                alt={author.name + "Profile Image"}
              />
            </div>
          </div>
          <div className="order-3 md:order-2 col-span-12 md:col-span-9 ml-0 md:ml-3 lg:ml-6 xl:-ml-2 py-0 md:py-3">
            <div className="flex flex-col">
              <div className="flex flex-row justify-start items-start gap-2">
                <div className="font-semibold text-lg">{author.name}</div>
                <div className="text-gray-150 text-md mt-0.5"></div>
              </div>
              <div className="text-xs lg:text-sm">
                As a passionate writer, I draw inspiration from everyday
                moments, weaving them into stories that connect with people. My
                journey into writing began in childhood, fueled by a love for
                books and a curiosity about the world. I believe in the power of
                words to inspire change and spark conversations. When I'm not
                writing, you'll find me exploring nature or enjoying a good cup
                of coffee.
              </div>
            </div>
          </div>
          <div className="order-2 md:order-3 col-span-10 md:col-span-1 ml-28 md:ml-2 xl:ml-20 lg:ml-8 pt-6 pb-0 md:py-6">
            <button className="w-28 h-10 text-lg font-semibold rounded-full bg-blue-500 text-white hover:text-blue-500 hover:bg-white hover:border border-blue-500">
              Follow
            </button>
          </div>
        </div>
        <div className="border-b border-gray-400 mt-2"></div>
      </div>
     
      <div className="mt-6">
        <div className="font-semibold text-lg">More from {author.name}</div>
        <ArticlesList data={authorPosts} />
        <div className="border-b border-gray-400 py-6"></div>
      </div>
    </div>
  );
}
