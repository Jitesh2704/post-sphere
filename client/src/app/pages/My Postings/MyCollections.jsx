import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPenSquare,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
import PostsService from "../../services/post-service/posts.service";
import UserCollectionsService from "../../services/post-service/user-collections.service";

const MyCollections = () => {
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const [selectedType, setSelectedType] = useState("article");
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(4); // Initially show 6 items
  const navigate = useNavigate();

  const getAllUserCollections = async () => {
    try {
      const response = await UserCollectionsService.getAllUserCollections(1, 1000, [], {
        user_id: current_user_id,
        is_deleted: false,
      });

      const data = response.data;

      // Extract post IDs from the fetched data
      const postIds = data.map((post) => post.post_id);

      // Fetch details of each post using their post_id
      const postData = await Promise.all(
        postIds.map(async (postId) => {
          try {
            const postDetailsResponse = await PostsService.getPost({
              post_id: postId,
            });
            return postDetailsResponse.data;
          } catch (error) {
            console.error("Error fetching post details:", error.message);
            // Handle error if necessary (e.g., set default data)
            return null; // or handle error in another way
          }
        })
      );

      // Filter posts based on selectedType
      const filteredPostData = postData.filter((post) => {
        if (post && post.post_type) {
          return post.post_type === selectedType;
        }
        return false;
      });
      setTotalPosts(filteredPostData.length);
      setPosts(filteredPostData);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  useEffect(() => {
    getAllUserCollections();
  }, [selectedType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleWriteArticleClick = () => {
    navigate("/post-details");
  };

  const handleLoadMore = () => {
    // Increment the number of items to show by 6 or less if already showing all posts
    setItemsToShow((prevItems) => Math.min(prevItems + 6, totalPosts));
  };

  return (
    <div className=" h-[100vh] overflow-y-auto custom-scrollbar">

    <div className="w-full px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 bg-neutral-100">
      <div className=" w-full h-full">
        <div className="mb-4 md:mb-0">
          <div className="font-bold whitespace-nowrap text-3xl md:text-4xl font-Poppins mb-8">
            My Collections
          </div>
          <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
            <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
              <div className="font-bold whitespace-nowrap text-2xl md:text-4xl font-Poppins mb-4 md:mb-0">
                {selectedType === "article" && "Articles"}
                {selectedType === "blog" && "Blogs"}
                {selectedType === "student-stories" && "Student Stories"}
              </div>

              <div className="relative md:mt-2">
                <div className="flex flex-row items-center">
                  <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="article">Articles</option>
                    <option value="blog">Blogs</option>
                    <option value="student-stories">Stories</option>
                  </select>
                  <div className="-ml-6 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-gray-500 text-xs md:text-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 md:gap-6 text-sm font-semibold xl:mt-16">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
                </div>
              </div> */}

              <button
                className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
                onClick={handleWriteArticleClick}
              >
                <FontAwesomeIcon icon={faPenSquare} />
                <p>Write a Post</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div>
          {!isLoaded ? (
            <div> data is loading </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 lg:gap-8 xl:gap-12">
              {posts.slice(0, itemsToShow).map((post, index) => (
                <div key={index} className="col-span-12 lg:col-span-6">
                  <ArticlePostTemplate data={post} />
                </div>
              ))}
            </div>
          )}
        </div>

        {itemsToShow < totalPosts && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyCollections;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSearch,
//   faPenSquare,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";

// import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
// import PostsService from "../../services/post-service/posts.service";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// const MyCollections = () => {
//   const { user } = useSelector((state) => state.auth);
//   const current_user_id = user?.user_id;
//   const [selectedType, setSelectedType] = useState("article");
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [itemsToShow, setItemsToShow] = useState(6); // Initially show 6 items
//   const navigate = useNavigate();

//   const getAllUserCollections = async (selectedType) => {
//     try {
//       const response = await UserCollectionsService.getAllUserCollections({
//         user_id: current_user_id,
//       });

//       const data = response.data;
//       const totalItems = data.length; // Count of items in the response data

//       setTotalPosts(totalItems);

//       // Extract post IDs from the fetched data
//       const postIds = data.map((post) => post.post_id);

//       // Fetch details of each post using their post_id
//       const postData = await Promise.all(
//         postIds.map(async (postId) => {
//           try {
//             const postDetailsResponse = await PostsService.getPost({
//               post_id: postId,
//             });
//             return postDetailsResponse.data;
//           } catch (error) {
//             console.error("Error fetching post details:", error.message);
//             // Handle error if necessary (e.g., set default data)
//             return null; // or handle error in another way
//           }
//         })
//       );

//       // Filter out posts that have been successfully fetched
//       const filteredPostData = postData.filter((post) => post !== null);

//       setPosts(filteredPostData);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     getAllUserCollections();
//   }, [selectedType]);

//   const handleTypeChange = (event) => {
//     setSelectedType(event.target.value);
//   };

//   const handleWriteArticleClick = () => {
//     navigate("/post-details");
//   };

//   const handleLoadMore = () => {
//     // Increment the number of items to show by 6
//     setItemsToShow((prevItems) => prevItems + 6);
//   };

//   return (
//     <div className="w-full px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 bg-neutral-100">
//       <div className=" w-full h-full">
//         <div className="mb-4 md:mb-0">
//           <div className="font-bold whitespace-nowrap text-3xl md:text-4xl font-Poppins mb-8">
//             My Collections
//           </div>
//           <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
//             <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
//               <div className="font-bold whitespace-nowrap text-2xl md:text-4xl font-Poppins mb-4 md:mb-0">
//                 {selectedType === "article" && "Articles"}
//                 {selectedType === "blog" && "Blogs"}
//                 {selectedType === "student-stories" && "Student Stories"}
//               </div>

//               <div className="relative md:mt-2">
//                 <div className="flex flex-row items-center">
//                   <select
//                     value={selectedType}
//                     onChange={handleTypeChange}
//                     className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="article">Articles</option>
//                     <option value="blog">Blogs</option>
//                     <option value="student-stories">Stories</option>
//                   </select>
//                   <div className="-ml-6 flex items-center pointer-events-none">
//                     <FontAwesomeIcon
//                       icon={faChevronDown}
//                       className="text-gray-500 text-xs md:text-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 md:gap-6 text-sm font-semibold xl:mt-16">
//               {/* <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
//                 />
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
//                 </div>
//               </div> */}

//               <button
//                 className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
//                 onClick={handleWriteArticleClick}
//               >
//                 <FontAwesomeIcon icon={faPenSquare} />
//                 <p>Write a Post</p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full">
//         <div>
//           {!isLoaded ? (
//             <div> data is loading </div>
//           ) : (
//             <div className="grid grid-cols-12 gap-4 lg:gap-8 xl:gap-12">
//               {posts.slice(0, itemsToShow).map((post, index) => (
//                 <div key={index} className="col-span-12 lg:col-span-6">
//                   <ArticlePostTemplate data={post} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {itemsToShow < totalPosts && (
//           <div className="flex justify-center mt-4">
//             <button
//               onClick={handleLoadMore}
//               className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
//             >
//               Load More
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyCollections;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSearch,
//   faPenSquare,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";

// import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
// import PostsService from "../../services/post-service/posts.service";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// const MyCollections = () => {
//   const { user } = useSelector((state) => state.auth);
//   const current_user_id = user?.user_id;
//   const [selectedType, setSelectedType] = useState("article");
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const articlesPerPage = 4;
//   const navigate = useNavigate();

//   const getAllUserCollections = async (selectedType) => {
//     try {
//       const response = await UserCollectionsService.getAllUserCollections({
//         user_id: current_user_id,
//       });

//       const data = response.data;
//       const totalItems = data.length; // Count of items in the response data

//       setTotalPosts(totalItems);

//       // Extract post IDs from the fetched data
//       const postIds = data.map((post) => post.post_id);

//       // Fetch details of each post using their post_id
//       const postData = await Promise.all(
//         postIds.map(async (postId) => {
//           try {
//             const postDetailsResponse = await PostsService.getPost({post_id : postId});
//             return postDetailsResponse.data;
//           } catch (error) {
//             console.error("Error fetching post details:", error.message);
//             // Handle error if necessary (e.g., set default data)
//             return null; // or handle error in another way
//           }
//         })
//       );

//       // Filter out posts that have been successfully fetched
//       const filteredPostData = postData.filter((post) => post !== null);

//       setPosts(filteredPostData);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     getAllUserCollections();
//   }, [selectedType, currentPage]);

//   const handleTypeChange = (event) => {
//     setSelectedType(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleWriteArticleClick = () => {
//     navigate("/post-details");
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   // Calculate total number of pages based on totalPosts state and articlesPerPage
//   const totalPages = Math.ceil(totalPosts / articlesPerPage) || 1; // Ensure totalPages is at least 1

//   return (
//     <div className="w-full px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 bg-neutral-100">
//       <div className=" w-full h-full">
//         <div className="mb-4 md:mb-0">
//           <div className="font-bold whitespace-nowrap text-3xl md:text-4xl font-Poppins mb-8">
//             My Collections
//           </div>
//           <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
//             <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
//               <div className="font-bold whitespace-nowrap text-2xl md:text-4xl font-Poppins mb-4 md:mb-0">
//                 {selectedType === "article" && "Articles"}
//                 {selectedType === "blog" && "Blogs"}
//                 {selectedType === "student-stories" && "Student Stories"}
//               </div>

//               <div className="relative md:mt-2">
//                 <div className="flex flex-row items-center">
//                   <select
//                     value={selectedType}
//                     onChange={handleTypeChange}
//                     className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="article">Articles</option>
//                     <option value="blog">Blogs</option>
//                     <option value="student-stories">Stories</option>
//                   </select>
//                   <div className="-ml-6 flex items-center pointer-events-none">
//                     <FontAwesomeIcon
//                       icon={faChevronDown}
//                       className="text-gray-500 text-xs md:text-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 md:gap-6 text-sm font-semibold xl:mt-16">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
//                 />
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
//                 </div>
//               </div>

//               <button
//                 className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
//                 onClick={handleWriteArticleClick}
//               >
//                 <FontAwesomeIcon icon={faPenSquare} />
//                 <p>Write a Post</p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full">
//         <div>
//           {!isLoaded ? (
//             <div> data is loading </div>
//           ) : (
//             <div className="grid grid-cols-12 gap-4 lg:gap-8 xl:gap-12">
//               {posts.map((post, index) => (
//                 <div key={index} className="col-span-12 lg:col-span-6">
//                   <ArticlePostTemplate data={post} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-center items-center gap-3 mt-4">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Previous
//           </button>
//           <div className="text-sm">
//             Page {currentPage} of {totalPages}
//           </div>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCollections;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSearch,
//   faPenSquare,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";

// import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
// import PostsService from "../../services/post-service/posts.service";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// const MyCollections = () => {
//   const { user } = useSelector((state) => state.auth);
//   const current_user_id = user?.user_id;
//   const [selectedType, setSelectedType] = useState("article");
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [inputSearch, setInputSearch] = useState("");
//   const articlesPerPage = 4;
//   const navigate = useNavigate();

//   const searchUserCollections = async (
//     page_number,
//     page_size,
//     selectedType,
//     search_keyword
//   ) => {
//     try {
//       const response = await UserCollectionsService.searchUserCollections({
//         post_type: selectedType,
//         user_id: current_user_id,
//       });
//       const { data, total } = response.data;
//       setTotalPosts(total);

//       // Fetch details of each post using their post_id
//       const postData = await Promise.all(
//         data.map(async (post) => {
//           const postDetailsResponse = await PostsService.getPost(post.post_id); // Use getPost function from PostsService
//           return postDetailsResponse.data;
//         })
//       );

//       setPosts(postData);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     searchUserCollections(
//       currentPage,
//       articlesPerPage,
//       selectedType,
//       inputSearch
//     );
//   }, [selectedType, currentPage, inputSearch]);

//   const handleTypeChange = (event) => {
//     setSelectedType(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (value) => {
//     setInputSearch(value);
//   };

//   const handleNextPage = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(Math.max(currentPage - 1, 1));
//   };

//   const handleWriteArticleClick = () => {
//     navigate("/post-details");
//   };

//   // Calculate total number of pages based on totalPosts state and articlesPerPage
//   const totalPages = Math.ceil(totalPosts / articlesPerPage) || 1; // Ensure totalPages is at least 1

//   return (
//     <div className="w-full px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 bg-neutral-100">
//       <div className=" w-full h-full">
//         <div className="mb-4 md:mb-0">
//           <div className="font-bold whitespace-nowrap text-3xl md:text-4xl font-Poppins mb-8">
//             My Collections
//           </div>
//           <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
//             <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
//               <div className="font-bold whitespace-nowrap text-2xl md:text-4xl font-Poppins mb-4 md:mb-0">
//                 {selectedType === "article" && "Articles"}
//                 {selectedType === "blog" && "Blogs"}
//                 {selectedType === "student-stories" && "Student Stories"}
//               </div>

//               <div className="relative md:mt-2">
//                 <div className="flex flex-row items-center">
//                   <select
//                     value={selectedType}
//                     onChange={handleTypeChange}
//                     className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="article">Articles</option>
//                     <option value="blog">Blogs</option>
//                     <option value="student-stories">Stories</option>
//                   </select>
//                   <div className="-ml-6 flex items-center pointer-events-none">
//                     <FontAwesomeIcon
//                       icon={faChevronDown}
//                       className="text-gray-500 text-xs md:text-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 md:gap-6 text-sm font-semibold xl:mt-16">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
//                 />
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
//                 </div>
//               </div>

//               <button
//                 className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
//                 onClick={handleWriteArticleClick}
//               >
//                 <FontAwesomeIcon icon={faPenSquare} />
//                 <p>Write a Post</p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full">
//         <div>
//           {!isLoaded ? (
//             <div> data is loading </div>
//           ) : (
//             <div className="grid grid-cols-12 gap-4 lg:gap-8 xl:gap-12">
//               {posts.map((post, index) => (
//                 <div key={index} className="col-span-12 lg:col-span-6">
//                   <ArticlePostTemplate data={post} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-center items-center gap-3 mt-4">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Previous
//           </button>
//           <div className="text-sm">
//             Page {currentPage} of {totalPages}
//           </div>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCollections;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSearch,
//   faPenSquare,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";
// import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// const MyCollections = () => {
//   const [selectedType, setSelectedType] = useState("article");
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [inputSearch, setInputSearch] = useState("");
//   const articlesPerPage = 4;
//   const navigate = useNavigate();

//   const searchUserCollections = async (
//     page_number,
//     page_size,
//     post_type,
//     search_keyword
//   ) => {
//     try {
//       const response = await UserCollectionsService.searchUserCollections({
//         page: page_number,
//         limit: page_size,
//         search: search_keyword,
//         filters: { postType: post_type },
//       });
//       const { data } = response.data;
//       setPosts(data);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     searchUserCollections(
//       currentPage,
//       articlesPerPage,
//       selectedType,
//       inputSearch
//     );
//   }, [selectedType, currentPage, inputSearch]);

//   const handleTypeChange = (event) => {
//     setSelectedType(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (value) => {
//     setInputSearch(value);
//   };

//   const handleNextPage = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(Math.max(currentPage - 1, 1));
//   };

//   const handleWriteArticleClick = () => {
//     navigate("/post-details");
//   };

//   return (
//     <div className="w-full px-6 lg:px-10 xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 bg-neutral-100">
//       <div className=" w-full h-full">
//         <div className="mb-4 md:mb-0">
//           <div className="font-bold whitespace-nowrap text-3xl md:text-4xl font-Poppins mb-8">
//             My Collections
//           </div>
//           <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
//             <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
//               <div className="font-bold whitespace-nowrap text-2xl md:text-4xl font-Poppins mb-4 md:mb-0">
//                 {selectedType === "article" && "Articles"}
//                 {selectedType === "blog" && "Blogs"}
//                 {selectedType === "student-stories" && "Student Stories"}
//               </div>

//               <div className="relative md:mt-2">
//                 <div className="flex flex-row items-center">
//                   <select
//                     value={selectedType}
//                     onChange={handleTypeChange}
//                     className="block appearance-none w-24 md:w-24 xl:w-32 border border-gray-300 text-xs md:text-md xl:text-lg px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="article">Articles</option>
//                     <option value="blog">Blogs</option>
//                     <option value="student-stories">Stories</option>
//                   </select>
//                   <div className="-ml-6 flex items-center pointer-events-none">
//                     <FontAwesomeIcon
//                       icon={faChevronDown}
//                       className="text-gray-500 text-xs md:text-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 md:gap-6 text-sm font-semibold xl:mt-16">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
//                 />
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
//                 </div>
//               </div>

//               <button
//                 className="flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
//                 onClick={handleWriteArticleClick}
//               >
//                 <FontAwesomeIcon icon={faPenSquare} />
//                 <p>Write a Post</p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full">
//         <div>
//           {!isLoaded ? (
//             <div> data is loading </div>
//           ) : (
//             <div className="grid grid-cols-12 gap-4 lg:gap-8 xl:gap-12">
//               {posts.map((post, index) => (
//                 <div key={index} className="col-span-12 lg:col-span-6">
//                   <ArticlePostTemplate data={post} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-center items-center gap-3 mt-4">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Previous
//           </button>
//           <div className="text-sm">
//             Page {currentPage} of {Math.ceil(totalPosts / articlesPerPage)}
//           </div>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === Math.ceil(totalPosts / articlesPerPage)}
//             className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCollections;
