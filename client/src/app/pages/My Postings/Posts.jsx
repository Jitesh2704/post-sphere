import React, { useState, useEffect } from "react";
import PostsService from "../../services/post-service/posts.service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ArticlePostTemplate from "../../components/My Postings/templates/ArticlePostTemplate";
import Collections from "../../components/My Postings/Collections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPenSquare,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const Posts = () => {
  const [selectedType, setSelectedType] = useState("article");
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userCollects, setUserCollects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const articlesPerPage = 6;

  const navigate = useNavigate();

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      const response = await PostsService.searchPosts({
        page: currentPage,
        limit: articlesPerPage,
        search: inputSearch,
        filters: { postType: selectedType, isDraft: false },
      });
      const { data, pagination } = response.data;
      setPosts(data);
      setTotalPosts(pagination.totalItems);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedType, currentPage, inputSearch]);

  // Handle type change function
  const handleTypeChange = (post) => {
    setSelectedType(post.target.value);
    setCurrentPage(1); // Reset page number when type changes
  };

  // Handle search change function
  const handleSearchChange = (value) => {
    setInputSearch(value);
  };

  // Handle next page function
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalPosts / articlesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page function
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle write article click function
  const handleWriteArticleClick = () => {
    window.open("/post-details", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-14 h-[100vh] overflow-y-auto custom-scrollbar">
      {" "}
      <div className="p-8">
        <div className="grid grid-cols-12 w-full h-full">
          <div className="col-span-12 md:col-span-7 border-r border-gray-300 ">
            <div className="ml-6 flex flex-col xl:flex-row justify-start md:justify-between items-start gap-6 mb-6 md:mb-10">
              <div className="flex flex-row xl:flex-col-reverse gap-6 md:gap-6 xl:gap-3">
                <div className="font-bold whitespace-nowrap text-3xl font-Poppins mb-4 md:mb-0">
                  {selectedType === "article" && "Articles"}
                  {selectedType === "blog" && "Blogs"}
                  {selectedType === "student-stories" && "Student Stories"}
                </div>

                <div className="relative md:mt-2">
                  <div className="flex flex-row items-center">
                    <select
                      value={selectedType}
                      onChange={handleTypeChange}
                      className="block appearance-none w-24 md:w-24 xl:w-24 border border-gray-300 text-xs md:text-md xl:text-xs px-1 md:px-4 py-2 rounded-md bg-white leading-tight focus:outline-none focus:shadow-outline"
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

              <div className="flex flex-row gap-3 md:gap-6 text-sm font-semibold xl:mt-12">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-36 md:w-56 border border-gray-300 px-4 py-2 rounded-full pl-10 placeholder-gray-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <button
                  className="mr-8 flex justify-between px-3 md:px-4 py-2 bg-blue-500 text-white rounded-full gap-2 items-center hover:shadow-2xl hover:border border-black whitespace-nowrap"
                  onClick={handleWriteArticleClick}
                >
                  <FontAwesomeIcon icon={faPenSquare} />
                  <p>Write a Post</p>
                </button>
              </div>
            </div>
            <div>
              {!isLoaded ? (
                <div> data is loading </div>
              ) : (
                // expecting user's collection
                posts.map((post, index) => (
                  <div key={index} className="px-4">
                    <ArticlePostTemplate
                      data={post}
                      bookMarked={userCollects.some(
                        (collect) => collect._id === post._id
                      )}
                    />
                    {index < posts.length - 1 && (
                      <hr className="my-4 border-t border-gray-300" />
                    )}
                  </div>
                ))
              )}
            </div>
            {posts.length === 0 ? (
              <div className="text-center">No {selectedType} available</div>
            ) : (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of{" "}
                  {totalPosts ? Math.ceil(totalPosts / articlesPerPage) : 1}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(totalPosts / articlesPerPage)
                  }
                  className="px-3 py-1 bg-gray-200 rounded-full hover:border border-black"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-5 pl-8">
            <Collections userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;

// const Posts = () => {
//   const [selectedType, setSelectedType] = useState("article");
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [userCollects, setUserCollects] = useState([]);
//   const [inputSearch, setInputSearch] = useState("");
//   const articlesPerPage = 6;
//   const navigate = useNavigate();
//   const userId = 1;

//   const handleWriteArticleClick = () => {
//     navigate("/post-details");
//   };

//   // const getAllPosts = async (page_number, page_size, post_type) => {
//   //   try {
//   //     const response = await PostsService.getAllPosts(
//   //       page_number,
//   //       page_size,
//   //       post_type
//   //     );
//   //     const { data } = response;

//   //     setPosts(data);
//   //     setIsLoaded(true);
//   //   } catch (error) {
//   //     console.error("Error fetching posts:", error.message);
//   //   }
//   // };
// const getAllPosts = async (page_number, page_size, post_type, fields) => {
//   try {
//     const response = await PostsService.getAllPosts(
//       page_number,
//       page_size,
//       post_type,
//       fields // Pass the 'fields' parameter to the service function
//     );
//     const { data } = response;

//     // Proceed with setting posts and updating the loaded state
//     setPosts(data);
//     setIsLoaded(true);
//   } catch (error) {
//     console.error("Error fetching posts:", error.message);
//   }
// };

//   const search = async (page_number, page_size, post_type, search_keyword) => {
//     try {
//       const response = await PostsService.searchPosts(
//         page_number,
//         page_size,
//         post_type,
//         search_keyword
//       );
//       const { data } = response;

//       setPosts(data);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching posts:", error.message);
//     }
//   };

//   useEffect(() => {
//     getAllPosts(currentPage, articlesPerPage, selectedType);
//   }, [selectedType, currentPage]);

//   useEffect(() => {
//     search(currentPage, articlesPerPage, selectedType, inputSearch);
//   }, [inputSearch]);

//   const handleTypeChange = (event) => {
//     setSelectedType(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (value) => {
//     setInputSearch(value);
//   };

//   const handleNextPage = () => {
//     setIsLoaded(false);
//     setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     setIsLoaded(false);
//     setCurrentPage(Math.max(currentPage - 1, 1));
//   };
//   //   // const [collectionData, setCollectionData] = useState(collectionsDataSet);
//   //   const [selectedType, setSelectedType] = useState("article");
//   //   const [totalPosts, setTotalPosts] = useState(2);
//   //   const [currentPage, setCurrentPage] = useState(1);
//   //   const [isLoaded, setIsLoaded] = useState(false);
//   //   const [posts, setPosts] = useState([]);
//   //   const [userCollects, setUserCollects] = useState([]);
//   //   const [inputSearch, setInputSearch] = useState();
//   //   const articlesPerPage = 2;
//   //   const navigate = useNavigate();
//   //   const userId = 1;
//   //   const handleWriteArticleClick = () => {
//   //     navigate("/post-details");
//   //   };

//   //   // const getAllPosts = async (page_number, page_size, post_type) => {
//   //   //   try {
//   //   //     const response = await PostServices.getAllPosts(pageNumber, pageSize, postType, userId);
//   //   //     setPosts(response.data.array);
//   //   //     setTotalPosts(response.data.numberOfPosts);
//   //   //     setUserCollects(response.data.userCollections); // this is the bookmarked collection
//   //   //     setIsLoaded(true);
//   //   //   } catch (error) {
//   //   //     console.error("Error fetching posts:", error.message);
//   //   //   }
//   //   // };
//   //   const getAllPosts = async (page_number, page_size, post_type, userId) => {
//   //     try {
//   //       const response = await PostServices.getAllPosts(
//   //         page_number,
//   //         page_size,
//   //         post_type,
//   //         userId
//   //       );
//   //       const { array: posts, numberOfPosts, userCollections } = response.data;

//   //       setPosts(posts);
//   //       setTotalPosts(numberOfPosts);
//   //       setUserCollects(userCollections);
//   //       setIsLoaded(true);
//   //     } catch (error) {
//   //       console.error("Error fetching posts:", error.message);
//   //     }
//   //   };

//   //   // const search = async (page_number, page_size, post_type, search_keyword) => {
//   //   //   try {
//   //   //     const response = await axios.get(
//   //   //       `http://localhost:3001/api/posts/searchByTag?pageNumber=${page_number}&pageSize=${page_size}&postType=${post_type}&searchKeyword=${search_keyword}`
//   //   //     );
//   //   //     setPosts(response.data.array);
//   //   //     setTotalPosts(response.data.numberOfPosts);
//   //   //     setIsLoaded(true);
//   //   //   } catch (error) {
//   //   //     console.error("Error fetching posts: ", error.message);
//   //   //   }
//   //   // };

//   //   const search = async (page_number, page_size, post_type, search_keyword) => {
//   //     try {
//   //       const response = await PostServices.searchPosts(
//   //         page_number,
//   //         page_size,
//   //         post_type,
//   //         search_keyword
//   //       );
//   //       const { array: posts, numberOfPosts } = response.data;

//   //       setPosts(posts);
//   //       setTotalPosts(numberOfPosts);
//   //       setIsLoaded(true);
//   //     } catch (error) {
//   //       console.error("Error fetching posts: ", error.message);
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     getAllPosts(currentPage, articlesPerPage, selectedType);
//   //   }, [selectedType, currentPage]);

//   //   const handleTypeChange = (event) => {
//   //     setSelectedType(event.target.value);
//   //     setCurrentPage(1);
//   //   };

//   //   useEffect(() => {
//   //     search(currentPage, articlesPerPage, selectedType, inputSearch);
//   //   }, [inputSearch]);

//   //   const handleSearchChange = (value) => {
//   //     setInputSearch(value);
//   //   };

//   //   const handleNextPage = () => {
//   //     setIsLoaded(false);
//   //     setCurrentPage(currentPage + 1);
//   //   };

//   //   const handlePrevPage = () => {
//   //     setIsLoaded(false);
//   //     setCurrentPage(Math.max(currentPage - 1, 1));
//   //   };
